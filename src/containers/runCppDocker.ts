// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


async function runCpp(code: string,inputTestCase:string){
    console.log("Initializing cpp new docker container");
    await pullImage(CPP_IMAGE);
    let runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase}' | stdbuf -oL -eL ./main`;
    const cppDockerContainer = await createContainer(CPP_IMAGE,[
        '/bin/sh',
        '-c',
         runCommand
    ]);

    const rawLogBuffer : Buffer[] = [];
    await cppDockerContainer.start();
    console.log("started docker container");
    
    const loggerStream  = await cppDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true // whether the logs are streamed or returned as a string

    })

    // Attach events on stream objects to start ans stop reading
    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    })

    const response = await new Promise((res)=>{
        loggerStream.on('end',()=>{
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            res(decodedStream);
        });
    })
    
    await cppDockerContainer.remove(); // remove the container after execution.
    return response;

}
export default runCpp;