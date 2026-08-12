import type { Request, Response } from "express";
import { brainStorage } from "../ai/BrainStorage";

export function listBrains(_request: Request, response: Response) {
  response.json({ brains: brainStorage.list() });
}

export function saveBrain(request: Request, response: Response) {
  const brain = brainStorage.save(request.body);
  response.status(201).json({ brain });
}
