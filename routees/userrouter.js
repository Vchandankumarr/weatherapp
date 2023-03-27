const express=require("express")
const {Users}=require("../models/user")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {client}=require("../cache")



const userrouter=express.Router()

userrouter.get("/",async(req,res)=>
{
    try {
        res.send("weather app users router")
    } catch (error) {
        
    }
})

// signup



userrouter.post("/signup",async(req,res)=>
{
console.log(req.body)
    const {name,email,password}=req.body
    try {
        let existing_user=await Users.find({email})
        if(existing_user.length>0){
            res.send("already logged in please login")
        }else{
                bcrypt.hash(password,5,async(err,hash)=>{
                    if(err){
                        res.send(err)
                    }else{
                        let user=new Users({name,email,password:hash})
                        await user.save()
                        res.send(user)
                    }
                })
        }
        
    } catch (error) {
        res.send(err)
    }
})

// login

userrouter.post("/login",async(req,res)=>
{
    console.log("loginnnnnnn")
    let {email,password}=req.body
    try {
        let user=await Users.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,async(err,result)=>
            {
                if(result){
                    const token=jwt.sign({userid:user[0]._id},process.env.token)
                    await client.set("token",token)
                    res.send({"message":"login sucessfull",token})
                }else{
                    res.send("wrong credentials")
                }
            })
        }else{
            res.send("please login")
        }
    } catch (error) {
        res.send(error)
    }
})


// logout

userrouter.get("/logout",async(req,res)=>
{
    let token=req.headers.authorization

    try {
        await client.set("blacklist_token",token)
        
        res.send("token blacklisted")
    } catch (error) {
        res.send(error)
    }
})

module.exports={
    userrouter
}