import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true,limit:"16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";
import courseRouter from "./routes/courses.js";

app.use("/api/v1/users", userRouter)
app.use("/api/v1/admins", adminRouter)
app.use("api/v1/courses", courseRouter)

import {errorHandler} from "./middlewares/error.middleware.js"
app.use(errorHandler)

export {app}
