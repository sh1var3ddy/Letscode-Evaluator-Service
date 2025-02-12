import { IJob } from "../types/bullMqJobDefinition";
import {Job} from "bullmq";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/createExecutor";
import { ExecutionResponse } from "../types/CodeExecutor";
import evaluationQueueProducer from "../producers/evaluationQueueProducer";

export default class SubmissionJob implements IJob{
    name:string;
    payload:Record<string,SubmissionPayload>;
    constructor(payload:Record<string,SubmissionPayload>){
        this.payload = payload;
        this.name = this.constructor.name;
    }
    handle = async (job?:Job)=>{
        console.log("Handler of the job called");
        // console.log(this.payload);
        if(job){
            const key = Object.keys(this.payload)[0];
            const codelanguage = this.payload[key].language;
            const code  = this.payload[key].code;
            const inputTestCase = this.payload[key].inputCase;
            const outputTestCase = this.payload[key].outputCase;
            console.log(this.payload[key].language);
            const strategy = createExecutor(codelanguage);
            if(strategy!=null){
                const response:ExecutionResponse = await strategy.execute(code,inputTestCase,outputTestCase);
                evaluationQueueProducer({response,userId:this.payload[key].userId,submissionId:this.payload[key].submissionId});
                if(response.status==="COMPLETED"){
                    console.log("Code executed successfully");
                    console.log(response);
                }else{
                    console.log("Something went wrong ",response);
                }
            }
        }
    }
    failed=(job?:Job):void=>{
        console.log("Job failed");
        if(job){
            console.log(job.id);
        }
    }
}   