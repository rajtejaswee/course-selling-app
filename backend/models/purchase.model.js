import mongoose from "mongoose";
const Schema = mongoose.Schema

const purchaseSchema = new Schema({
    courseId:{
        type: Schema.Types.ObjectId, 
        ref:'courses'
    },
    userId:{
        type: Schema.Types.ObjectId, 
        ref:'users'
    }
})

const PurchaseModel = mongoose.model('purchase', purchaseSchema)
export default PurchaseModel