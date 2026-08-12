import { Router } from "express";
import { listBrains, saveBrain } from "../controllers/brainsController";

export const brainsRouter = Router();

brainsRouter.get("/", listBrains);
brainsRouter.post("/", saveBrain);
