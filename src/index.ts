import express from "express";
import serverConfig from "./config/serverConfig";
console.log("hello");
console.log("wow");
const app = express();
app.listen(serverConfig.PORT,()=>{
    console.log(`App listening on port ${serverConfig.PORT}`);
})