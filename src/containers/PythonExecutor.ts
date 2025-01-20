// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, { ExecutionResponse } from '../types/CodeExecutor';


class PythonExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        console.log("Initializing python new docker container");
        pullImage(PYTHON_IMAGE);
        let runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > test.py && echo '${inputTestCase}' | python3 test.py`;
        // const pythonDockerContainer = await createContainer(PYTHON_IMAGE,['python3','-c',code,'stty -echo']);
        const pythonDockerContainer = await createContainer(PYTHON_IMAGE,[
            '/bin/sh',
            '-c',
            runCommand
        ]);

        const rawLogBuffer : Buffer[] = [];
        await pythonDockerContainer.start();
        console.log("started docker container");
        
        const loggerStream  = await pythonDockerContainer.logs({
            stdout:true,
            stderr:true,
            timestamps:false,
            follow:true // whether the logs are streamed or returned as a string

        })

        // Attach events on stream objects to start ans stop reading
        loggerStream.on('data',(chunk)=>{
            rawLogBuffer.push(chunk);
        })
        try{    
            const codeResponse:string = await this.fetchDecodedStream(loggerStream,rawLogBuffer);
            return {output:codeResponse,status:"COMPLETED"};
        }catch(error){
            return {output:error as string,status:"INCOMPLETE"};
        }finally{
            await pythonDockerContainer.remove(); // remove the container after execution.
        }
    }
    fetchDecodedStream(loggerStream:NodeJS.ReadableStream,rawLogBuffer:Buffer[]):Promise<string>{
        return new Promise((res,rej)=>{
            loggerStream.on('end',()=>{
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                console.log(decodedStream);
                if(decodedStream.stderr){
                    rej(decodedStream.stderr);
                }else{
                    res(decodedStream.stdout);
                }
            });
        })
        
    }
    
}

export default PythonExecutor;