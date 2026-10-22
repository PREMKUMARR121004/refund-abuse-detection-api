import User from "./models/User.js";
import connectDb from "./config/db.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
  process.exit(1)
}
await connectDb()
const adminthere=await User.exists({role:"admin"})
if(adminthere){
    console.log("admin is there")
    process.exit(0)
}
const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });

if (existingUser) {
    console.log(`Email already exists with role: ${existingUser.role}`);
    process.exit(0);
}
const name="karthi"
    const email=process.env.ADMIN_EMAIL
    const password=process.env.ADMIN_PASSWORD
const hashsedPassword=await bcrypt.hash(password,10)
const role="admin"
     const adminRegistered=await User.create({
        name,
        email,
        password:hashsedPassword,
        role

     })
     console.log("admin created successfully");
     process.exit()
