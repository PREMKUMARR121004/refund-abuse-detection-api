export const adminMiddleware=(req,res,next)=>{
    if(req.user?.role!=="admin"){
        return res.status(403).json("your not admin")
    }
    console.log("your admin")
    next()
}