import JavaExecutor from "../containers/JavaExecutor";
import PythonExecutor from "../containers/PythonExecutor";
import CodeExecutorStrategy from "../types/CodeExecutor";

export default function createExecutor(codeLanguage:string):CodeExecutorStrategy|null{
    if(codeLanguage==='PYTHON'){
        return new PythonExecutor();
    }else if(codeLanguage==="JAVA"){
        return new JavaExecutor();
    }else{
        return null;
    }
}