const validator = require("validator");
const validatesignupdata = (req) =>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName || !emailId || !password){
        throw new Error("invalid signupdata");
    }
    else if(!validator.isEmail(emailId)){
    throw new Error("invalid emailid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("invalid password");
    }
}

const validateProfileEditdata = (req)=>{
    const allowedFeilds = ["firstName",'lastName',"gender","skills","age","photourl"];

    const iseditallowed = Object.keys(req.body).every((key)=>allowedFeilds.includes(key));
     return iseditallowed;
};
module.exports = {validatesignupdata,validateProfileEditdata};