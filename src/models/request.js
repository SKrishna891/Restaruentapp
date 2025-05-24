const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({

    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref:"User",
    },
    toUserId :{
        type :  mongoose.Schema.Types.ObjectId,
        require : true,
        ref:"User",
    },
    status :{
        type :String,
        enum :{
            values:["ignored","accepted","intrested","rejected"],
            message : "{value} is not supported"
        }
    }
},{timestamps : true});

connectionRequestSchema.pre("save",function(next){
    const ConnectionRequest = this;
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("canot send request to you");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);