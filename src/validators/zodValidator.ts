import { Request,Response,NextFunction } from "express";
import {ZodSchema} from "zod";

export const validateCreateSubmissionDto = (schema:ZodSchema<any>)=>(req:Request,res:Response,next:NextFunction)=>{
    try{
        schema.parse({
            ...req.body
        });
        next();
    }catch(error){
        console.log(error)
        return res.status(400).json({
            message:"Bad request"
        });
    }
}