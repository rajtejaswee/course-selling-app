import { Router } from "express";
import { signin,signup,logoutUser,refreshAccessToken, createcourse, getcourse, updateCourse, deleteCourse } from "../controllers/admin.controller.js";
import { verifyJWTAdmin } from "../middlewares/authAdmin.middleware.js";

const adminRouter = Router();

adminRouter.route("/register").post(signup)
adminRouter.route("/login").post(signin)
adminRouter.route("/refreshToken").post(refreshAccessToken)
adminRouter.route("/logout").post(verifyJWTAdmin,logoutUser)
adminRouter.route("/course").post(verifyJWTAdmin, createcourse)
adminRouter.route("/course").get(verifyJWTAdmin, getcourse)
adminRouter.route("/course/:courseId").put(verifyJWTAdmin, updateCourse)
adminRouter.route("/course/:courseId").delete(verifyJWTAdmin, deleteCourse)
export default adminRouter;