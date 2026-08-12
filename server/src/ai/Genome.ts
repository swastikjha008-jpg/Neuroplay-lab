import { NeuralNetwork } from "./NeuralNetwork";
import { randomUUID } from "node:crypto";

export class Genome {
  readonly id = randomUUID();
  fitness = 0;

  constructor(readonly brain: NeuralNetwork) {}
}
