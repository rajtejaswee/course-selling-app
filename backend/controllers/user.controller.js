import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import { signinSchema, signupSchema } from "../utils/validation.js";
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
        
    }
}


const signup = asyncHandler(async(req,res) => {
    const parse = signupSchema.safeParse(req.body)
    if(!parse.success) {
        throw new ApiError(404, "Validation Failed", parse.error.errors)
    }
    const {username, email, password} = parse.data;
    const existedUser = await UserModel.findOne({
        $or:[{username}, {email}]
    })
    if(existedUser) {
        throw new ApiError(409, "User Already Exists")
    }
    const user = await UserModel.create({
        username, 
        email,
        password,
    })

    const createdUser = await UserModel.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const signin = asyncHandler(async(req,res) => {
    const parse = signinSchema.safeParse(req.body)
    if(!parse.success) {
        throw new ApiError(400, "Validation Failed", parse.error.errors)
    }
    const{email, password} =parse.data;
    const user = await UserModel.findOne({
        $or: [{email}]
    })
    if(!user) {
        throw new ApiError(401, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Enter the valid password")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id)
    const loggerUser = await UserModel.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
        new ApiResponse(200,{
            user:loggerUser, accessToken, refreshToken
            },
            "User Logged in Successfully"
        )   
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id, 
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly: true,
        secure:process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await UserModel.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateRefreshAndAccessToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export {
    signup,
    signin,
    logoutUser,
    refreshAccessToken
}