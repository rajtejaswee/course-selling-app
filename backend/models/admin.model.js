import mongoose from "mongoose";
import { authpluginAdmin } from "./plugins/authAdmin.plugin.js";
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

adminSchema.plugin(authpluginAdmin)
const AdminModel = mongoose.model('admin', adminSchema)
export default AdminModel