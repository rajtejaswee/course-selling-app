import mongoose from "mongoose";
import { authplugin } from "./plugins/auth.plugin";
const Schema = mongoose.Schema

const adminSchema = new Schema({
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

adminSchema.plugin(authplugin)
const AdminModel = mongoose.model('admin', adminSchema)
export default AdminModel