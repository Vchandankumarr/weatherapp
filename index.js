const express=require("express")
require("dotenv").config()
const {connection}=require("./config/db")
const {userrouter}=require("./routees/userrouter")
const {weatherrouter}=require("./routees/weather")
const {authentication}=require("./middlewares/authentication")

const winston=require("winston")
const expresswinston=require("express-winston")
require("winston-mongodb")
const app=express()
app.use(express.json())

app.use(expresswinston.logger({
    statusLevels:true,
    transports:[
        new winston.transports.File({
            level:"info",
            filename:"log.json"
        }),
    new winston.transports.MongoDB({
        level:"info",
        db:process.env.mongo_url
    })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )

}))



app.get("/",async(req,res)=>
{
    try {
        res.send("weather app")
    } catch (error) {
        
    }
})

app.use("/users",userrouter)
app.use(authentication)
app.use("/weather",weatherrouter)




app.get("/weather",authentication,async(req,res)=>
{
    try {
        res.send("authentication")
    } catch (error) {
        
    }
})

let port=process.env.port
app.listen(port,async()=>
{
    try {
        await connection
        console.log("connected to database")
        
    } catch (error) {
        
    }
    console.log(`server is running in port ${port}`)
})