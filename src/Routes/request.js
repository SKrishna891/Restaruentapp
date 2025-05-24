const express = require("express");

const mongoose = require("mongoose");

const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");

const ConnectionRequest = require("../models/request");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res) =>{

   try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedFeilds = ["ignored","intrested"];

    if(!allowedFeilds.includes(status)){
        return res.status(404).send("Invalid status");
    };
    

     const existingRequest = await ConnectionRequest.findOne({$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]});

     if(existingRequest){
        return res.status(404).send("request already exists");
     };
     const toUser = await User.findById(toUserId);

     if(!toUser){
        return res.status(400).send("user not found");
     }
     const connectionrequest = new ConnectionRequest({fromUserId,toUserId,status});
     await connectionrequest.save();

     res.status(200).json({ message: `${req.user.firstName} is ${status} in ${toUser.firstName}` });
    }catch(err){
        res.status(400).send("Error :"+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res) =>{
    try{
const loginuserId = req.user._id;

const {status,requestId } = req.params;

const allowedFeilds = ["accepted","rejected"];

if(!allowedFeilds.includes(status)){
return res.status(404).json({message :"invalid status"});
};



const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId.toString(),
    toUserId : loginuserId,
    status:"intrested",
});

if(!connectionRequest){
    throw new Error("request not found");
}
connectionRequest.status = status;

const data = await connectionRequest.save();

res.status(200).json({ message: "Reviewed the connection request", data });
}catch(err){
    res.status(404).json("Error :"+err.message);
}
});

module.exports = requestRouter;