import { Genome } from "@/lib/ai/Genome";
import { NeuralNetwork } from "@/lib/ai/NeuralNetwork";

export class Population {
  genomes: Genome[];

  constructor(size: number, layers: number[]) {
    this.genomes = Array.from({ length: size }, () => new Genome(new NeuralNetwork(layers)));
  }

  get best() {
    return [...this.genomes].sort((a, b) => b.fitness - a.fitness)[0];
  }
}
