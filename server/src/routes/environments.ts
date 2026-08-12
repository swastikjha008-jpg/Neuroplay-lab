import { Router } from "express";
import { listEnvironments } from "../controllers/environmentsController";

export const environmentsRouter = Router();

environmentsRouter.get("/", listEnvironments);
