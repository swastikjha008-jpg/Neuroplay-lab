import { NeuralNetwork } from "@/lib/ai/NeuralNetwork";

export type GenomeSnapshot = {
  id: string;
  fitness: number;
  brain: NeuralNetwork;
};

export class Genome {
  readonly id = crypto.randomUUID();
  fitness = 0;

  constructor(public brain: NeuralNetwork) {}

  clone() {
    const weights = this.brain.weights.map((layer) => layer.map((neuron) => [...neuron]));
    const genome = new Genome(new NeuralNetwork([...this.brain.layers], weights));
    genome.fitness = this.fitness;
    return genome;
  }
}
