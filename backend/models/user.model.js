import mongoose from "mongoose";
import { authpluginUser } from "./plugins/authUser.plugin.js";
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


userSchema.plugin(authpluginUser)
const UserModel = mongoose.model('users', userSchema)
export default UserModel;