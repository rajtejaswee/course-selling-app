import mongoose from "mongoose";
const Schema = mongoose.Schema

const purchaseSchema = new Schema({
     userId:{
        type: Schema.Types.ObjectId, 
        ref:'users'
    },
    courseId:{
        type: Schema.Types.ObjectId, 
        ref:'courses'
    },
})

purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const PurchaseModel = mongoose.model('purchase', purchaseSchema)
export default PurchaseModel