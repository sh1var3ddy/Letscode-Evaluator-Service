import express from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
console.log("hello");
console.log("wow");
const app = express();

app.use("/api",apiRouter);
app.listen(serverConfig.PORT,()=>{
    console.log(`App listening on port ${serverConfig.PORT}`);
})