import Router from "express"
import { verifyJWTUser } from "../middlewares/authUser.middleware.js"
import { getMyCourses, previewAllCourses, purchaseCourse } from "../controllers/course.controller.js"

const courseRouter = Router()

// an endpoint to hit when user hits buying a course
courseRouter.route('/purchase').post(verifyJWTUser, purchaseCourse )
courseRouter.route('/preview',).get(previewAllCourses)
courseRouter.route('/my-courses').get(verifyJWTUser, getMyCourses)

export default courseRouter