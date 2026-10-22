import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

 const connectDb=async()=>{
   try{
   await mongoose.connect(process.env.MONGO_URI)
   console.log("db connected")
   }
   catch(error){
    console.log("connection failed".error.message);
    
   }

}
export default connectDb