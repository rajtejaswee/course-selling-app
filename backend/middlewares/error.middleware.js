import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res,next) => {
    if(err instanceof ApiError) {
        const statusCode = Number(err.statusCode) || 500;
        return res.status(statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data:null,
        });
    }
    console.log("Unhandled Error", err);
    return res.status(500).json({
        sucess: false,
        message: "Internal Server Error. Something went wrong"
    });
}

export {errorHandler}
