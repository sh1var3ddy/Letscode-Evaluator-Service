import evaluationQueue from "../queues/evaluationQueue";

export default async function(payload:Record<string,unknown>){
    await evaluationQueue.add("EvaluationJob",payload);
    console.log("sucessfully added a new evaluation job");
}