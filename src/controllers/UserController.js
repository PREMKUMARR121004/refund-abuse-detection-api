 import User from '../models/User.js'
 import bcrypt from 'bcrypt'
 import jwt from 'jsonwebtoken'
 export const registerUser=async(req,res,next)=>{
    const{name,email,password}=req.body

    if(!name||!email||!password){
      return res.status(400).json("all filed must be filled")
    }
    try{
      const emailCheck=await User.findOne({email:email})
      if(emailCheck){
         return res.status(400).json("already existing email")
      }
      const hashsedPassword=await bcrypt.hash(password,10)

     const creatednewUser =await User.create({
      name:name,
      email:email,
      password:hashsedPassword
     })
     return res.status(201).json({
      User:{
         name:creatednewUser.name,
         email:creatednewUser.email
   
      }
     })
    }
     catch(error){
      next(error)
     }

 }

 export const UserLogin=async (req,res,next)=>{
   const {email,password}=req.body
   if(!email||!password){
      return res.status(400).json("all field must be filled")
   }
   try{
       const Userlogged=await User.findOne({email:email})
       if(!Userlogged){
         return res.status(401).json("User not match")
       }
       const passwordCheck=await bcrypt.compare(password,Userlogged.password)
       if(!passwordCheck){
         return res.status(401).json("password not match")
       }
       const token=jwt.sign({
         userID:Userlogged._id,
         email:Userlogged.email,
         role:Userlogged.role

       },process.env.JWT_SECRET,{expiresIn:"1d"})
       return res.status(200).json({
         token:token,
         name:Userlogged.name,
         email:Userlogged.email,
         role:Userlogged.role
       })
   }catch(error){
      next(error)
   }
 }