import express, { Router }  from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducers from "./producers/sampleQueueProducers";
import SampleWorker from "./workers/SampleWorker";

const app = express();

app.use("/api",apiRouter as Router);
app.listen(serverConfig.PORT,()=>{
    console.log(`App listening on port ${serverConfig.PORT}`);
    SampleWorker("SampleQueue");
    sampleQueueProducers('SampleJob',{
        name:"Shiva",
        college:"UC",
        degree:"Msaters"
    });
});