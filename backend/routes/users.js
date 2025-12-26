import { Router } from "express";
import { signin,signup,logoutUser,refreshAccessToken, getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWTUser } from "../middlewares/authUser.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(signup)
userRouter.route("/login").post(signin)
userRouter.route("/refreshToken").post(refreshAccessToken)
userRouter.route("/logout").post(verifyJWTUser,logoutUser)
userRouter.route("/current-user").get(verifyJWTUser, getCurrentUser);

export default userRouter;