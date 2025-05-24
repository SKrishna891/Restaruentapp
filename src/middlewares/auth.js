const User = require("../models/user");

const jwt = require("jsonwebtoken");



const userAuth = async (req,res,next) => {
    try{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).send("Please Login!");
    };
    const decodedmessage = await jwt.verify(token,"Dev@Tinder");

    const{_id} = decodedmessage;

    const user = await User.findById({_id});
    if(!user){
        throw new Error("user not defined");
    }
    req.user = user;

    next();
}catch(err){
    res.status(404).send("Error :"+err.message);
}
};

module.exports = userAuth;