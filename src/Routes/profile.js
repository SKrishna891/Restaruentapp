const express = require("express");

const profileRouter = express.Router();

const userAuth = require("../middlewares/auth");

const {validateProfileEditdata} = require("../utils/validate");

profileRouter.get("/profile/view",userAuth, async(req,res) => {

    const user =  req.user;

    res.send(user);
    
});

profileRouter.post("/profile/editData", userAuth, async (req,res)=>{
if(!validateProfileEditdata(req)){
    throw new Error("invalid edit data");
}
    const loginuser = req.user;
    console.log(loginuser);
    Object.keys(req.body).forEach(key=>(loginuser[key] = req.body[key]));
    await loginuser.save();
    console.log(loginuser);
    res.send("data updated sucessfully");

});
module.exports = profileRouter;