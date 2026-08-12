import type { Environment } from "../ai/Environment";
import { evolve } from "../ai/Evolution";
import { Genome } from "../ai/Genome";
import { NeuralNetwork } from "../ai/NeuralNetwork";
import { brainStorage } from "../ai/BrainStorage";
import { environmentRegistry } from "../services/environmentRegistry";

type EnvironmentSlug = "flappy" | "dino" | "snake";
type RenderState = Record<string, unknown>;

type Agent = {
  genome: Genome;
  environment: Environment;
  fitness: number;
  done: boolean;
  lastInputs: number[];
  lastOutputs: number[];
  hidden: number[];
};

export type TrainingSnapshot = {
  environment: EnvironmentSlug;
  running: boolean;
  mode: "training" | "replay";
  generation: number;
  generationLimit: number;
  population: number;
  configuredPopulation: number;
  alive: number;
  dead: number;
  bestScore: number;
  highestEver: number;
  averageFitness: number;
  mutationRate: number;
  simulationSpeed: number;
  fps: number;
  elapsedSeconds: number;
  currentScore: number;
  inputs: Array<{ label: string; value: number }>;
  outputs: Array<{ label: string; value: number }>;
  history: Array<{ generation: number; best: number; average: number; survival: number }>;
  network: { hidden: number[]; weights: number[][][] };
  render: RenderState;
  message?: string;
};

const labels: Record<EnvironmentSlug, { inputs: string[]; outputs: string[]; layers: number[] }> = {
  flappy: { inputs: ["Altitude", "Velocity", "Gap distance", "Gap center"], outputs: ["Jump", "Hold"], layers: [4, 6, 2] },
  dino: { inputs: ["Obstacle X", "Obstacle height", "Grounded", "Jump velocity"], outputs: ["Jump", "Run"], layers: [4, 6, 2] },
  snake: { inputs: ["Food X", "Food Y", "Wall proximity", "Body risk"], outputs: ["Up", "Right", "Down", "Left"], layers: [4, 8, 4] }
};

export class TrainingSession {
  private environmentId: EnvironmentSlug;
  private genomes: Genome[] = [];
  private agents: Agent[] = [];
  private bestGenome: Genome | null = null;
  private generation = 1;
  private generationLimit = 500;
  private populationSize = 60;
  private mutationRate = 0.08;
  private simulationSpeed = 10;
  private running = false;
  private mode: "training" | "replay" = "training";
  private replayAgent: Agent | null = null;
  private history: TrainingSnapshot["history"] = [];
  private generationFrames = 0;
  private simulationStepCarry = 0;
  private measuredFrames = 0;
  private fpsSampleStartedAt = Date.now();
  private fps = 0;
  private message: string | undefined;

  constructor(environment: EnvironmentSlug) {
    this.environmentId = environment;
    this.createPopulation();
  }

  configure(environment: EnvironmentSlug) {
    this.environmentId = environment;
    this.reset();
  }

  start() {
    this.running = true;
    this.mode = "training";
    this.message = undefined;
  }

  pause() {
    this.running = false;
  }

  reset() {
    this.running = false;
    this.mode = "training";
    this.generation = 1;
    this.history = [];
    this.generationFrames = 0;
    this.simulationStepCarry = 0;
    this.measuredFrames = 0;
    this.fpsSampleStartedAt = Date.now();
    this.bestGenome = null;
    this.replayAgent = null;
    this.message = undefined;
    this.createPopulation();
  }

  setSpeed(speed: number) {
    this.simulationSpeed = Math.max(1, Math.min(100, Math.round(speed)));
  }

  setMutation(rate: number) {
    this.mutationRate = Math.max(0.01, Math.min(0.4, rate));
  }

  setPopulation(size: number) {
    this.populationSize = Math.max(10, Math.min(1000, Math.round(size)));
    this.reset();
  }

  setGenerationLimit(limit: number) {
    this.generationLimit = Math.max(1, Math.min(10000, Math.round(limit)));
  }

  replayBest() {
    const source = this.bestGenome ?? [...this.genomes].sort((a, b) => b.fitness - a.fitness)[0];
    if (!source) return;
    this.mode = "replay";
    this.replayAgent = this.createAgent(new Genome(source.brain.clone()));
    this.running = true;
    this.message = "Replaying best brain";
  }

  saveBrain() {
    const source = this.bestGenome ?? [...this.genomes].sort((a, b) => b.fitness - a.fitness)[0];
    if (!source) return null;
    const brain = brainStorage.save({
      environment: this.environmentId,
      generation: this.generation,
      fitness: source.fitness,
      layers: source.brain.layers,
      weights: source.brain.weightMatrix
    });
    this.message = "Brain saved";
    return brain;
  }

  loadLatestBrain() {
    const stored = brainStorage.latest(this.environmentId);
    const payload = stored?.payload as { layers?: number[]; weights?: number[][][] } | undefined;
    if (!payload?.layers || !payload.weights) {
      this.message = "No saved brain for this environment";
      return;
    }
    const loaded = new Genome(new NeuralNetwork(payload.layers, payload.weights));
    this.genomes = Array.from({ length: this.populationSize }, (_, index) => index === 0 ? new Genome(loaded.brain.clone()) : this.mutateFrom(loaded));
    this.generationFrames = 0;
    this.createAgents();
    this.running = true;
    this.mode = "training";
    this.message = "Brain loaded into the next population";
  }

  tick() {
    if (!this.running) return;
    const steps = this.takeSimulationSteps();
    let executedFrames = 0;
    if (this.mode === "replay") {
      executedFrames = this.advanceAgent(this.replayAgent, steps);
      this.generationFrames += executedFrames;
      if (this.replayAgent?.done) {
        this.running = false;
        this.message = "Replay complete";
      }
    } else {
      for (let step = 0; step < steps; step += 1) {
        for (const agent of this.agents) {
          if (!agent.done) this.advanceAgent(agent, 1);
        }
        this.generationFrames += 1;
        executedFrames += 1;
        if (this.agents.every((agent) => agent.done)) {
          this.finishGeneration();
          break;
        }
      }
    }
    this.recordSimulationFrames(executedFrames);
  }

  snapshot(): TrainingSnapshot {
    const representative = this.mode === "replay" ? this.replayAgent : this.representative();
    const activeAgents = this.mode === "replay" ? (this.replayAgent && !this.replayAgent.done ? 1 : 0) : this.agents.filter((agent) => !agent.done).length;
    const currentFitness = representative?.fitness ?? 0;
    const historicalBest = this.bestGenome?.fitness ?? Number.NEGATIVE_INFINITY;
    const network = representative?.genome.brain.predictWithActivations(representative.lastInputs.length ? representative.lastInputs : representative.environment.getState()) ?? { outputs: [], activations: [[], []] };
    const signals = labels[this.environmentId];
    return {
      environment: this.environmentId,
      running: this.running,
      mode: this.mode,
      generation: this.generation,
      generationLimit: this.generationLimit,
      population: this.mode === "replay" ? 1 : this.populationSize,
      configuredPopulation: this.populationSize,
      alive: activeAgents,
      dead: (this.mode === "replay" ? 1 : this.populationSize) - activeAgents,
      bestScore: Math.max(historicalBest, currentFitness),
      highestEver: Math.max(historicalBest, ...this.history.map((point) => point.best), currentFitness),
      averageFitness: this.agents.length ? Math.round(this.agents.reduce((sum, agent) => sum + agent.fitness, 0) / this.agents.length) : Math.round(currentFitness),
      mutationRate: this.mutationRate,
      simulationSpeed: this.simulationSpeed,
      fps: this.running ? this.fps : 0,
      elapsedSeconds: Math.floor(this.generationFrames / 60),
      currentScore: Math.round(currentFitness),
      inputs: signals.inputs.map((label, index) => ({ label, value: clamp(representative?.lastInputs[index] ?? 0) })),
      outputs: signals.outputs.map((label, index) => ({ label, value: clamp(network.outputs[index] ?? representative?.lastOutputs[index] ?? 0) })),
      history: this.history,
      network: { hidden: network.activations[network.activations.length - 2] ?? [], weights: representative?.genome.brain.weightMatrix ?? [] },
      render: (representative?.environment as Environment & { getRenderState?: () => RenderState }).getRenderState?.() ?? {},
      message: this.message
    };
  }

  private createPopulation() {
    const definition = environmentRegistry.get(this.environmentId);
    const config = labels[this.environmentId];
    if (!definition) throw new Error(`Unknown environment: ${this.environmentId}`);
    this.genomes = Array.from({ length: this.populationSize }, () => new Genome(new NeuralNetwork(config.layers)));
    this.createAgents();
  }

  private createAgents() {
    this.agents = this.genomes.map((genome) => this.createAgent(genome));
  }

  private createAgent(genome: Genome): Agent {
    const definition = environmentRegistry.get(this.environmentId);
    if (!definition) throw new Error(`Unknown environment: ${this.environmentId}`);
    const environment = definition.create();
    const state = environment.reset();
    return { genome, environment, fitness: 0, done: false, lastInputs: state, lastOutputs: [], hidden: [] };
  }

  private advanceAgent(agent: Agent | null, steps: number) {
    if (!agent || agent.done) return 0;
    let completedSteps = 0;
    for (let index = 0; index < steps && !agent.done; index += 1) {
      const state = agent.environment.getState();
      const prediction = agent.genome.brain.predictWithActivations(state);
      agent.lastInputs = state;
      agent.lastOutputs = prediction.outputs;
      agent.hidden = prediction.activations[prediction.activations.length - 2] ?? [];
      const action = this.chooseAction(prediction.outputs);
      const result = agent.environment.step(action);
      agent.fitness += result.reward;
      agent.done = result.done;
      completedSteps += 1;
    }
    return completedSteps;
  }

  private chooseAction(outputs: number[]) {
    if (this.environmentId === "snake") return outputs.indexOf(Math.max(...outputs));
    return (outputs[0] ?? 0) > (outputs[1] ?? 0) ? 1 : 0;
  }

  private finishGeneration() {
    const sorted = [...this.agents].sort((a, b) => b.fitness - a.fitness);
    const best = sorted[0];
    const average = this.agents.reduce((sum, agent) => sum + agent.fitness, 0) / Math.max(1, this.agents.length);
    this.bestGenome = !this.bestGenome || best.fitness > this.bestGenome.fitness ? new Genome(best.genome.brain.clone()) : this.bestGenome;
    this.bestGenome.fitness = Math.max(this.bestGenome.fitness, best.fitness);
    this.history = [...this.history.slice(-31), { generation: this.generation, best: Math.round(best.fitness), average: Math.round(average), survival: Math.round((this.agents.filter((agent) => !agent.done).length / this.populationSize) * 100) }];
    if (this.generation >= this.generationLimit) {
      this.running = false;
      this.message = "Generation limit reached";
      return;
    }
    this.genomes = evolve(this.agents.map((agent) => {
      agent.genome.fitness = agent.fitness;
      return agent.genome;
    }), this.mutationRate);
    this.generation += 1;
    this.generationFrames = 0;
    this.createAgents();
  }

  private takeSimulationSteps() {
    // The 20 Hz telemetry loop represents one half-speed simulation frame at 1x.
    // Carrying the remainder keeps every control value an exact multiplier.
    this.simulationStepCarry += this.simulationSpeed / 2;
    const steps = Math.floor(this.simulationStepCarry);
    this.simulationStepCarry -= steps;
    return steps;
  }

  private recordSimulationFrames(frames: number) {
    this.measuredFrames += frames;
    const now = Date.now();
    const elapsed = now - this.fpsSampleStartedAt;
    if (elapsed >= 500) {
      this.fps = Math.round((this.measuredFrames * 1000) / elapsed);
      this.measuredFrames = 0;
      this.fpsSampleStartedAt = now;
    }
  }

  private mutateFrom(parent: Genome) {
    const weights = parent.brain.weightMatrix.map((layer) => layer.map((neuron) => neuron.map((weight) => Math.random() < this.mutationRate ? weight + (Math.random() * 2 - 1) * 0.35 : weight)));
    return new Genome(new NeuralNetwork(parent.brain.layers, weights));
  }

  private representative() {
    return [...this.agents].sort((a, b) => b.fitness - a.fitness)[0];
  }
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, (value + 1) / 2));
}
