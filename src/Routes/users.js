const express = require("express");
const userAuth = require("../middlewares/auth");

const ConnectionRequest = require("../models/request");
const { set } = require("mongoose");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/users/requests/received", userAuth, async (req,res) =>{

try{

    const loginuser = req.user;
    const connections = await ConnectionRequest.find({
        toUserId : loginuser._id,
        status : "intrested",
    }).populate("fromUserId","firstName lastName");
    if(!connections){
        throw new Error("No connection requests");
    }
    res.json(connections);
}catch(err){
    res.status(404).json("Error :" +err.message);
}

});

userRouter.get("/users/connections", userAuth, async (req,res) =>{
    try{
  const loginuser = req.user;

  const connectionRequests = await ConnectionRequest.find({
    $or :[
        {fromUserId :loginuser._id, status:"accepted"},{
            toUserId: loginuser._id, status:"accepted"
        }
    ]
  }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
  if(!connectionRequests){
    throw new Error("no requests found");
  }
  res.json(connectionRequests);
    }catch(err){
        res.status(404).json("Error :" +err.message);
    }
});


userRouter.get("/user/feed",userAuth, async (req,res) =>{
    try{
    const loginuser = req.user;

    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);

    limit = limit>50? 50 :limit;

    const skip = (page -1)*limit;

    const connectioRequests = await ConnectionRequest.find({$or :[{fromUserId : loginuser._id},{toUserId : loginuser._id}]}).select("fromUserId toUserId");

    const hiderequestsFromfeed = new Set();
    connectioRequests.forEach((req)=>{
        hiderequestsFromfeed.add(req.fromUserId.toString());
        hiderequestsFromfeed.add(req.toUserId.toString());
    });
    const users = await User.find({$and :[
        {_id :{$nin: Array.from(hiderequestsFromfeed)}},{
            _id: {$ne: loginuser._id}
        }
    ]}).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json(users);
}catch(err){
    console.err("Error in getting feed",err);
}
})
module.exports = userRouter;