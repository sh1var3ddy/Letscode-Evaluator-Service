import { IJob } from "../types/bullMqJobDefinition";
import {Job} from "bullmq";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/createExecutor";
import { ExecutionResponse } from "../types/CodeExecutor";
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
            console.log(this.payload[key].language);
            const strategy = createExecutor(codelanguage);
            if(strategy!=null){
                const response:ExecutionResponse = await strategy.execute(this.payload[key].code,this.payload[key].inputCase);
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