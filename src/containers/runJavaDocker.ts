// import Docker from 'dockerode';

// import { TestCases } from '../types/testCases';
import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';


async function runJava(code: string,inputTestCase:string){
    console.log("Initializing java new docker container");
    pullImage(JAVA_IMAGE);
    let runCommand = `echo '${code.replace(/'/g,`'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase}' | java Main`;
    const javaDockerContainer = await createContainer(JAVA_IMAGE,[
        '/bin/sh',
        '-c',
         runCommand
    ]);

    const rawLogBuffer : Buffer[] = [];
    await javaDockerContainer.start();
    console.log("started docker container");
    
    const loggerStream  = await javaDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true // whether the logs are streamed or returned as a string

    })

    // Attach events on stream objects to start ans stop reading
    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    })

    await new Promise((res)=>{
        loggerStream.on('end',()=>{
            console.log(rawLogBuffer);
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            res(decodedStream)
        });
    })
    
    await javaDockerContainer.remove(); // remove the container after execution.

}
export default runJava;