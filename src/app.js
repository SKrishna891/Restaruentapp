const express = require("express");

const app = express();

app.use("/test", (req,res)=> {
    res.send("Hello from the server1");
})

app.listen(3000,()=>{
    console.log("server is running sucessfully");
});