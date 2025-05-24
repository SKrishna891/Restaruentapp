const express = require("express");
const connectDB = require("./configure/database");

const cors = require("cors");

const app = express();



const cookieparser = require("cookie-parser");

const authRouter = require("./Routes/auth");

const profileRouter = require("./Routes/profile");

const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/users");

app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.json());
app.use(cookieparser());

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);







connectDB().
then(()=>{
    console.log("database conmnected sucessfully");
    app.listen(3000,()=>{
        console.log("server is running sucessfully");
    });
}).catch(()=> {
    console.error("database connection not eshatblioshed");
});


