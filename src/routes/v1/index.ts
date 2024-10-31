import express from "express";
import { Router } from "express";
import { pingCheck } from "../../controllers/pingController";

const v1Router:Router = express.Router();

v1Router.get("/ping", pingCheck as any);  

export default v1Router;