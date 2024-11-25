import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

function decodeDockerStream(buffer:Buffer):DockerStreamOutput{
    let offset = 0 ; // this is variable to track current posotion in the buffer while parsing
    
    // The output that will store the accumulated stdput and stderr output as strings
    const output : DockerStreamOutput = {stdout:'',stderr:''};
    
    // loop until offset reaches end of buffer
    while(offset<buffer.length){
        const channel = buffer[offset];
        // length of the buffer
        const length = buffer.readUInt32BE(offset+4);
        offset+=DOCKER_STREAM_HEADER_SIZE;
        if(channel === 1){
            // sdtout stream
            output.stdout+=buffer.toString('utf-8',offset,offset+length);
        }
        else if(channel === 2){
            // stderr stream
            output.stderr+=buffer.toString('utf-8',offset,offset+length);
        }
        offset+=length; // to move offset to next chunk
    }
    return output;
}

export default decodeDockerStream;