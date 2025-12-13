import mongoose from "mongoose";
const Schema = mongoose.Schema


const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: {
        type: Schema.Types.ObjectId, 
        ref:'admins'
    }
})

const CourseModel = mongoose.model('courses',courseSchema)

export default CourseModel