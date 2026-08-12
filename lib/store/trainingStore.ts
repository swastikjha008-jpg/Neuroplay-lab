"use client";

import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import type { BrainSignal, EnvironmentSlug, FitnessPoint, TrainingStats } from "@/lib/types";

type NetworkTelemetry = { hidden: number[]; weights: number[][][] };
type RenderState = Record<string, unknown>;
type TrainingSnapshot = {
  environment: EnvironmentSlug;
  running: boolean;
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
  inputs: BrainSignal[];
  outputs: BrainSignal[];
  history: FitnessPoint[];
  network: NetworkTelemetry;
  render: RenderState;
  message?: string;
};

type TrainingState = {
  activeEnvironment: EnvironmentSlug;
  connected: boolean;
  running: boolean;
  stats: TrainingStats;
  history: FitnessPoint[];
  inputs: BrainSignal[];
  outputs: BrainSignal[];
  network: NetworkTelemetry;
  render: RenderState;
  generationLimit: number;
  currentScore: number;
  populationSetting: number;
  notice?: string;
  connect: (environment: EnvironmentSlug) => void;
  disconnect: () => void;
  setEnvironment: (environment: EnvironmentSlug) => void;
  toggleRunning: () => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  replayBest: () => void;
  saveBrain: () => void;
  loadBrain: () => void;
  setSpeed: (speed: number) => void;
  setPopulation: (population: number) => void;
  setMutation: (mutationRate: number) => void;
  setGenerationLimit: (limit: number) => void;
};

let socket: Socket | null = null;

const initialStats: TrainingStats = {
  generation: 1,
  population: 60,
  alive: 60,
  bestScore: 0,
  highestEver: 0,
  averageFitness: 0,
  mutationRate: 0.08,
  simulationSpeed: 10,
  fps: 0,
  elapsedSeconds: 0
};

const initialSignals: BrainSignal[] = [
  { label: "Altitude", value: 0.5 },
  { label: "Velocity", value: 0.5 },
  { label: "Gap distance", value: 0.5 },
  { label: "Gap center", value: 0.5 }
];

function applySnapshot(snapshot: TrainingSnapshot) {
  useTrainingStore.setState({
    activeEnvironment: snapshot.environment,
    connected: true,
    running: snapshot.running,
    generationLimit: snapshot.generationLimit,
    populationSetting: snapshot.configuredPopulation,
    currentScore: snapshot.currentScore,
    history: snapshot.history,
    inputs: snapshot.inputs,
    outputs: snapshot.outputs,
    network: snapshot.network,
    render: snapshot.render,
    notice: snapshot.message,
    stats: {
      generation: snapshot.generation,
      population: snapshot.population,
      alive: snapshot.alive,
      bestScore: Math.round(snapshot.bestScore),
      highestEver: Math.round(snapshot.highestEver),
      averageFitness: Math.round(snapshot.averageFitness),
      mutationRate: snapshot.mutationRate,
      simulationSpeed: snapshot.simulationSpeed,
      fps: snapshot.fps,
      elapsedSeconds: snapshot.elapsedSeconds
    }
  });
}

export const useTrainingStore = create<TrainingState>((set) => ({
  activeEnvironment: "flappy",
  connected: false,
  running: false,
  stats: initialStats,
  history: [],
  inputs: initialSignals,
  outputs: [
    { label: "Jump", value: 0.5 },
    { label: "Hold", value: 0.5 }
  ],
  network: { hidden: [0, 0, 0, 0, 0, 0], weights: [] },
  render: {},
  generationLimit: 500,
  currentScore: 0,
  populationSetting: 60,
  connect: (environment) => {
    if (socket) socket.disconnect();
    const nextSocket = io(process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000", { transports: ["websocket"] });
    socket = nextSocket;
    nextSocket.on("connect", () => {
      if (socket !== nextSocket) return;
      nextSocket.emit("training:configure", { environment });
      set({ connected: true });
    });
    nextSocket.on("training:update", (snapshot: TrainingSnapshot) => {
      if (socket === nextSocket) applySnapshot(snapshot);
    });
    nextSocket.on("training:notice", (message: string) => {
      if (socket === nextSocket) set({ notice: message });
    });
    nextSocket.on("disconnect", () => {
      if (socket === nextSocket) set({ connected: false, running: false });
    });
  },
  disconnect: () => {
    socket?.disconnect();
    socket = null;
    set({ connected: false, running: false });
  },
  setEnvironment: (environment) => set({ activeEnvironment: environment }),
  toggleRunning: () => {
    const running = useTrainingStore.getState().running;
    if (running) useTrainingStore.getState().pause();
    else useTrainingStore.getState().start();
  },
  start: () => socket?.emit("training:start"),
  pause: () => socket?.emit("training:pause"),
  reset: () => socket?.emit("training:reset"),
  replayBest: () => socket?.emit("training:replay"),
  saveBrain: () => socket?.emit("training:saveBrain"),
  loadBrain: () => socket?.emit("training:loadBrain"),
  setSpeed: (speed) => socket?.emit("training:setSpeed", speed),
  setPopulation: (population) => socket?.emit("training:setPopulation", population),
  setMutation: (mutationRate) => socket?.emit("training:setMutation", mutationRate),
  setGenerationLimit: (limit) => {
    set({ generationLimit: limit });
    socket?.emit("training:setGenerationLimit", limit);
  }
}));
