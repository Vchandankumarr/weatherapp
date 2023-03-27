const {client}=require("../cache")
const jwt=require("jsonwebtoken")
// require("jsonwebtoken").config()
const authentication=async(req,res,next)=>
{
    let token=req.headers.authorization
    try {
        let blacklist_token=await client.get("blacklist_token")
    if(token==blacklist_token){
        res.send("token is blacklisted please login again")
    }else{
        jwt.verify(token,process.env.token,async(err,decoded)=>
        {
            if(err){
                res.send("pleaes login")
            }else{
                userid=decoded.userid
                req.body.userid=userid
                next()
            }
        })
    }
        
    } catch (error) {
        res.send(error)
    }
    
}

module.exports={
    authentication
}