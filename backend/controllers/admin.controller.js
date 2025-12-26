import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdminModel from "../models/admin.model.js";
import CourseModel from "../models/course.model.js"
import { courseSchema, signinSchema, signupSchema } from "../utils/validation.js";
import jwt from "jsonwebtoken"


const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await AdminModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
        } 
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
        }
    }


    const signup = asyncHandler(async(req,res) => {
        const parse = signupSchema.safeParse(req.body)
        if(!parse.success) {
            throw new ApiError(404, "Validation Failed", parse.error.errors)
        }
        const {username, email, password} = parse.data;
        const existedUser = await AdminModel.findOne({
            $or:[{username}, {email}]
        })
        if(existedUser) {
        throw new ApiError(409, "User Already Exists")
        }
        const user = await AdminModel.create({
            username,
            email,
            password,
        })
        const createdUser = await AdminModel.findById(user._id).select("-password -refreshToken")
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
        const user = await AdminModel.findOne({
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
        const loggerUser = await AdminModel.findById(user._id).select("-password -refreshToken")
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
                }, "User Logged in Successfully")
            )
        }
    )



    const logoutUser = asyncHandler(async(req,res) => {
    await AdminModel.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken: 1
        }
    },{
        new:true
    })
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
        const user = await AdminModel.findById(decodedToken?._id)
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
            new ApiResponse(200,{accessToken, refreshToken: newRefreshToken},"Access token refreshed"
        ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})



const createcourse = asyncHandler(async(req, res) => {
    const parse = courseSchema.safeParse(req.body)
    if(!parse.success) {
    throw new ApiError(404, "Validation Failed", parse.error.errors)
    }

    const {title, description, imageUrl, price} = parse.data;
    if ( [title, description, imageUrl, price].some(field => !field) ) {
        throw new ApiError(400, "All fields are required");
    }
    const adminId = req.admin?._id;
    const course = await CourseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    if (!course) {
    throw new ApiError(500, "Something went wrong while creating the course");
    }
    return res
        .status(201).json(new ApiResponse(201, {
            courseId: course._id,
            course: course
        }, "Course created successfully")
    );
})



const getcourse = asyncHandler(async (req, res) => {
  const adminId = req.admin?._id;

  const course = await CourseModel.findOne({
    creatorId: adminId,
  });

  return res

    .status(200)

    .json(
      new ApiResponse(
        200,

        { course },

        "Course fetched successfully"
      )
    );
});



const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const { title, description, imageUrl, price } = req.body;

  const course = await CourseModel.findOne({
    _id: courseId,

    creatorId: req.admin._id,
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (title) course.title = title;

  if (description) course.description = description;

  if (imageUrl) course.imageUrl = imageUrl;

  if (price) course.price = price;

  await course.save();

  return res

    .status(200)

    .json(new ApiResponse(200, course, "Course updated successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const adminId = req.admin._id;

  const deleteCourse = await CourseModel.findOneAndDelete({
    _id: courseId,

    creatorId: adminId,
  });

  if (!deleteCourse) {
    throw new ApiError(
      404,
      "Course not found or don't have the permission to delete it"
    );
  }

  return res

    .status(200)

    .json(new ApiResponse(200, {}, "Course deleted succesfully"));
});

export {
  signup,
  signin,
  logoutUser,
  refreshAccessToken,
  createcourse,
  getcourse,
  updateCourse,
  deleteCourse,
};