export class NeuralNetwork {
  constructor(
    readonly layers: number[],
    readonly weights = NeuralNetwork.createWeights(layers)
  ) {}

  static createWeights(layers: number[]) {
    return layers.slice(1).map((layerSize, layerIndex) =>
      Array.from({ length: layerSize }, () =>
        Array.from({ length: layers[layerIndex] + 1 }, () => Math.random() * 2 - 1)
      )
    );
  }

  predict(inputs: number[]) {
    return this.predictWithActivations(inputs).outputs;
  }

  predictWithActivations(inputs: number[]) {
    const activations = [inputs];
    const outputs = this.weights.reduce((current, layer) => {
      const next = layer.map((neuron) => {
        const bias = neuron.at(-1) ?? 0;
        const signal = neuron
          .slice(0, -1)
          .reduce((total, weight, index) => total + weight * (current[index] ?? 0), bias);
        return 1 / (1 + Math.exp(-signal));
      });
      activations.push(next);
      return next;
    }, inputs);

    return { outputs, activations };
  }

  clone() {
    return new NeuralNetwork(this.layers, this.weights.map((layer) => layer.map((neuron) => [...neuron])));
  }

  get weightMatrix() {
    return this.weights.map((layer) => layer.map((neuron) => [...neuron]));
  }
}
