import { Genome } from "./Genome";
import { NeuralNetwork } from "./NeuralNetwork";

export class Population {
  readonly genomes: Genome[];
  generation = 1;

  constructor(size: number, layers: number[]) {
    this.genomes = Array.from({ length: size }, () => new Genome(new NeuralNetwork(layers)));
  }

  best() {
    return [...this.genomes].sort((a, b) => b.fitness - a.fitness)[0];
  }
}
