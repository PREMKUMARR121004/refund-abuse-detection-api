import mongoose from "mongoose";

const refundSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    },
    riskScore:{
        type:Number,
        default:0,
        min:0

    },
    riskLevel:{
        type:String,
        enum:["low","medium","high"],
        default:"low"

    }
},
{
    timestamps:true
})

const Refund=mongoose.model('Refund',refundSchema)

export default Refund