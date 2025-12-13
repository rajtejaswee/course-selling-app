import mongoose from "mongoose";
import { authplugin } from "./plugins/auth.plugin.js";
const Schema = mongoose.Schema


const userSchema = new Schema({
    username: String,
    email : {
        type: String, 
        unique: true
    },
    password: String,
    refreshToken: {
            type: String
    }
})


userSchema.plugin(authplugin)
const UserModel = mongoose.model('users', userSchema)
export default UserModel;