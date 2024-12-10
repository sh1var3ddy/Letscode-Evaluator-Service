import { IJob } from "../types/bullMqJobDefinition";
import {Job} from "bullmq";
import { SubmissionPayload } from "../types/submissionPayload";
import runCpp from "../containers/runCppDocker";
import runJava from "../containers/runJavaDocker";
import runPython from "../containers/runPythonDocker";
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
            console.log(this.payload[key].language);
            if(this.payload[key].language ==="CPP"){
                const response = await runCpp(this.payload[key].code,this.payload[key].inputCase);
                console.log("Evaluated response is ", response);
            }
            else if(this.payload[key].language ==="JAVA"){
                const response = await runJava(this.payload[key].code,this.payload[key].inputCase);
                console.log("Evaluated response is ", response);
            }
            else if(this.payload[key].language ==="PYTHON"){
                const response = await runPython(this.payload[key].code,this.payload[key].inputCase);
                console.log("Evaluated response is ", response);
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