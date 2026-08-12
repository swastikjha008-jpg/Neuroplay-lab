import { Genome } from "./Genome";
import { NeuralNetwork } from "./NeuralNetwork";

export function mutateGenome(parent: Genome, mutationRate: number) {
  const weights = parent.brain.weights.map((layer) =>
    layer.map((neuron) =>
      neuron.map((weight) => (Math.random() < mutationRate ? weight + (Math.random() * 2 - 1) * 0.35 : weight))
    )
  );
  return new Genome(new NeuralNetwork(parent.brain.layers, weights));
}
