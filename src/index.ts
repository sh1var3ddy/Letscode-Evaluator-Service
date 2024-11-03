import express, { Router }  from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducers from "./producers/sampleQueueProducers";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

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