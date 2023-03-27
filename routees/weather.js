const express=require("express")
const weatherrouter=express.Router()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {client}=require("../cache")
const {weather}=require("../models/weather")

weatherrouter.get("/",async(req,res)=>
{
    try {
        res.send("weaather router")
    } catch (error) {
        
    }
})

weatherrouter.get("/currentweather/:city",async(req,res)=>
{
    // console.log(req.params)
    let city=req.params.city
    
    try {
        let existing_weather=await client.get(`weather by ${city}`)
    if(existing_weather){
        res.send(existing_weather)
    }else{
        let weather=await fetch(`https://api.openweathermap.org/data/2.5/weather/${city}`).then((res)=>res.json())
        console.log(weather)
        let new_weather=new weather(weather)
        await new_weather.save()
        client.setEx(`weather by ${city}`,1800,`${weather}`)
        res.send(weather)
    }
        

    } catch (error) {
        res.send(error)
    }

    
    try {
res.send("current weather    "+city)
    } catch (error) {
        
    }
})


module.exports={
    weatherrouter
}
