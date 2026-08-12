import type { Request, Response } from "express";
import { environmentRegistry } from "../services/environmentRegistry";

export function listEnvironments(_request: Request, response: Response) {
  response.json({ environments: environmentRegistry.list() });
}
