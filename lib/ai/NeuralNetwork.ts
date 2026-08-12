export class NeuralNetwork {
  constructor(
    public readonly layers: number[],
    public readonly weights = NeuralNetwork.randomWeights(layers)
  ) {}

  static randomWeights(layers: number[]) {
    return layers.slice(1).map((size, layerIndex) =>
      Array.from({ length: size }, () =>
        Array.from({ length: layers[layerIndex] + 1 }, () => Math.random() * 2 - 1)
      )
    );
  }

  predict(inputs: number[]) {
    return this.weights.reduce((activations, layer) => {
      return layer.map((neuron) => {
        const bias = neuron[neuron.length - 1];
        const sum = neuron
          .slice(0, -1)
          .reduce((total, weight, index) => total + weight * (activations[index] ?? 0), bias);
        return 1 / (1 + Math.exp(-sum));
      });
    }, inputs);
  }
}
