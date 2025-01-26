import Docker from 'dockerode';

async function createContainer(imageName:string,cmdExecutable:string[]){
    const docker = new Docker();
    const container = await docker.createContainer({
        Image:imageName,
        Cmd:cmdExecutable,
        AttachStderr:true,
        AttachStdin:true,
        AttachStdout:true,
        Tty:false,
        HostConfig:{
            Memory:1024*1024*512, // max space allocated to each container 
        },
        OpenStdin:true
    })
    return container
}

export default createContainer;