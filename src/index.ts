import express, { Router }  from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
// import sampleQueueProducers from "./producers/sampleQueueProducers";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";
import SubmissionWorker from "./workers/SubmissionWorker";
import { SUBMISSION_QUEUE } from "./utils/constants";


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

app.use("/api",apiRouter as Router);
app.listen(serverConfig.PORT,()=>{
    console.log(`App listening on port ${serverConfig.PORT}`);
    SampleWorker("SampleQueue");
    SubmissionWorker(SUBMISSION_QUEUE);
    
    // sampleQueueProducers('SampleJob',{
    //     name:"Shiva",
    //     college:"UC",
    //     degree:"Masters"
    // });
//     const code =  `x = input()
// print("Value of x is",x)
//     `

    // const code = `
    // #include<iostream>
    // using namespace std;
    // int main(){
    //     int x;
    //     cin>>x;
    //     cout<<"Value of x is "<<x<<endl;
    //     for(int i=0;i<x;i++){
    //         cout<<i<<" ";
    //     }
    //     cout<<endl;
    //     return 0;
    // }
    // `;
    // const inputCase = `
    // 10
    // `
    // submissionQueueProducer({"1234":{
    //     language:"CPP",
    //     code,
    //     inputCase
    // }})
    // runCpp(code,inputTestCase);
});