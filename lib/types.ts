export type EnvironmentSlug = "flappy" | "dino" | "snake";

export type EnvironmentConfig = {
  slug: EnvironmentSlug;
  name: string;
  shortName: string;
  description: string;
  difficulty: string;
  bestScore: number;
  asset: string;
  background: string;
  obstacle: string;
  accent: string;
  inputs: string[];
  outputs: string[];
};

export type TrainingStats = {
  generation: number;
  population: number;
  alive: number;
  bestScore: number;
  highestEver: number;
  averageFitness: number;
  mutationRate: number;
  simulationSpeed: number;
  fps: number;
  elapsedSeconds: number;
};

export type FitnessPoint = {
  generation: number;
  best: number;
  average: number;
  survival: number;
};

export type BrainSignal = {
  label: string;
  value: number;
};
