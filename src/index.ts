import express, { Router }  from "express";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import sampleQueueProducers from "./producers/sampleQueueProducers";
import SampleWorker from "./workers/SampleWorker";
import bodyParser from "body-parser";
// import runPython from "./containers/runPythonDocker";
// import runJava from "./containers/runJavaDocker";
import runCpp from "./containers/runCppDocker";
// import pullImage from "./containers/pullImage";
// import { CPP_IMAGE } from "./utils/constants";

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
        degree:"Masters"
    });
//     const code =  `x = input()
// print("Value of x is",x)
//     `

    const code = `
    #include<iostream>
    using namespace std;
    int main(){
        int x;
        cin>>x;
        cout<<"Value of x is "<<x<<endl;
        for(int i=0;i<x;i++){
            cout<<i<<" ";
        }
        cout<<endl;
        return 0;
    }
    `;
    const inputTestCase = `
    10
    `
    runCpp(code,inputTestCase);
});