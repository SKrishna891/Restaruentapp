const express = require("express");

const authRouter = express.Router();
const {validatesignupdata} = require("../utils/validate");

const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async(req,res)=> {
    try{
validatesignupdata(req);
if(!validatesignupdata){
    throw new Error("data is invalid");
};
const {firstName,lastName,emailId,password} = req.body;
const passwordHash = await bcrypt.hash(password,10);
    const user = new User({firstName,lastName,emailId,password:passwordHash});
    const saveduser = await user.save();
    const token = await user.getJWT();

    res.cookie("token",token);
    res.json({message:"user data saved sucessfully", data : saveduser});
}catch(err){
    
    res.status(401).send("invalid Error:"+err.message);
}
});

authRouter.post("/login",async (req,res)=>{

    try{
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId:emailId});
    if(!user){
        throw new Error("invalid credintals");
    };
    const ispasswordvalid = await user.validatePassword(password);
    if(!ispasswordvalid){

         throw new Error("invalid credintials");
    }
    const token = await user.getJWT();

    res.cookie("token",token);
    
        res.send(user);
    }
    catch(err){
        res.status(401).send("ERROR:"+err.message);
    }
});

authRouter.post("/logout", (req,res) =>{
res.cookie("token",null,{expires: new Date(Date.now())});

res.send("logout sucessfull");
});
module.exports = authRouter;