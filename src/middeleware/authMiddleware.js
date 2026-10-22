import jwt from 'jsonwebtoken'
export const authMiddleware =(req,res,next)=>{
    const isToken=req.headers.authorization
    if(!isToken){
        return res.status(401).json({
            message:"Authorization is needed"
        })
    }
    const tobearercheck=isToken.split(" ")[0]
    if(tobearercheck!=="Bearer"){
        return res.status(401).json("not valid")

    }
    const splitbearer=isToken.split(" ")[1]
    if(!splitbearer){
        return res.status(401).json("after bearer ie empty")
    }
  
    try{
    const toVerify=jwt.verify(splitbearer,process.env.JWT_SECRET)

    if(!toVerify){
        return res.status(401).json("invalid and not match")
    }
    req.user=toVerify
    next()
} catch(error){
   return res.status(401).json("unauthorized")
}
   
}