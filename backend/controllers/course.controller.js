import PurchaseModel from "../models/purchase.model.js"
import CourseModel from "../models/course.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const purchaseCourse = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    const {courseId} = req.body.courseId

    const course = await CourseModel.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }


    const existingPurchase = await PurchaseModel.findOne({
        userId,
        courseId
    });
    if (existingPurchase) {
        throw new ApiError(400, "You have already purchased this course");
    }

    await PurchaseModel.create({
        userId,
        courseId
    })

     return res
        .status(200)
        .json(
            new ApiResponse(200,{}, "Course successfully bought")
    );
})

const previewAllCourses = asyncHandler(async(req,res) => {
    const courses = await CourseModel.find({});

    return res
    .status(200)
    .json(
        new ApiResponse(200, {courses}, "All the courses are")
    )
})

const getMyCourses = asyncHandler(async(req,res) => {
    const userId = req.user._id

    const purchase = await PurchaseModel.find({userId}).populate("courseId")

    if(!purchase) {
        throw new ApiError(404, "No courses found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, { purchases }, "Your courses fetched successfully")
    );
})

export {
    purchaseCourse,
    previewAllCourses,
    getMyCourses
}