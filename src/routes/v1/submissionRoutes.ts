import express from "express";
import { Router } from "express";
import {addSubmission} from "../../controllers/submissionController";
import { validateCreateSubmissionDto } from "../../validators/zodValidator";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";
const submissionRouter:Router = express.Router();

submissionRouter.post(
    "/",
    validateCreateSubmissionDto(createSubmissionZodSchema) as any,
    addSubmission as any
);  

export default submissionRouter;