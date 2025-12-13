import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"
import AdminModel from "../models/admin.model.js"

export const verifyJWTAdmin = asyncHandler(async(req,res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new ApiError(401, "Unauthorized User")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN)
        const admin = await AdminModel.findById(decodedToken?._id).select("-password -refreshToken")

        if(!admin) {
            throw new ApiError("401", "Inavalid Access Token")
        }
        req.admin = admin
        next()
    } catch (error) {
        throw new ApiError("401", error?.message || "Invalid Access Token")
    }
})