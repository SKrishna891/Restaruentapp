const mongoose = require("mongoose");

const validator = require("validator");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    firstName :{
        type :String,
        required : true,
        minLenghth :4,
    },
    lastName: {
        type : String,
        required : true,
        minLenghth :4,
    },
    emailId:{
        type: String,
        required: true,
        trim : true,
        unique : true,
        validate(value){
    if(!validator.isEmail(value)){
        throw new Error("Invalid email adress:" +value);
    }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid password :"+value);
            }
        }
    },
    phoneNumber : {
        type:Number,
    },
    age :{
        type : Number,
        min :18,
    },
    gender : {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("invalid gender");
            }
        }
    },
    photourl:{
        type : String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLcSefTqvRCC9oIxpwSPdj55AzSJ6rBnnA-pkIx85mz3TQe7v4Xunjddc&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid url:"+value);
            }
        }
    },
    skills :{
        type : [String],
    }
    
},{timestamps:true});

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id:user._id},"Dev@Tinder");

    return token;
};

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const ispasswordvalid = await bcrypt.compare(password,this.password);
    return ispasswordvalid;
    
}

const User = mongoose.model("User",userSchema);
module.exports = User;