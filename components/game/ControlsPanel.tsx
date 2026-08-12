"use client";

import { Pause, Play, RotateCcw, Save, Upload, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTrainingStore } from "@/lib/store/trainingStore";

const speeds = [1, 2, 5, 10, 20, 50, 100];

export function ControlsPanel() {
  const running = useTrainingStore((state) => state.running);
  const stats = useTrainingStore((state) => state.stats);
  const populationSetting = useTrainingStore((state) => state.populationSetting);
  const generationLimit = useTrainingStore((state) => state.generationLimit);
  const toggleRunning = useTrainingStore((state) => state.toggleRunning);
  const reset = useTrainingStore((state) => state.reset);
  const replayBest = useTrainingStore((state) => state.replayBest);
  const saveBrain = useTrainingStore((state) => state.saveBrain);
  const loadBrain = useTrainingStore((state) => state.loadBrain);
  const setSpeed = useTrainingStore((state) => state.setSpeed);
  const setPopulation = useTrainingStore((state) => state.setPopulation);
  const setMutation = useTrainingStore((state) => state.setMutation);
  const setGenerationLimit = useTrainingStore((state) => state.setGenerationLimit);
  const notice = useTrainingStore((state) => state.notice);

  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-lg font-semibold text-white">Controls</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="primary" onClick={toggleRunning}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button onClick={reset}>
          <RotateCcw size={16} />
          Reset
        </Button>
        <Button onClick={replayBest}>
          <Volume2 size={16} />
          Replay Best
        </Button>
        <Button onClick={saveBrain}>
          <Save size={16} />
          Save Brain
        </Button>
        <Button onClick={loadBrain} className="col-span-2">
          <Upload size={16} />
          Load Brain
        </Button>
      </div>
      <div className="mt-6">
        <label className="text-sm text-slate-300">Simulation Speed</label>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => setSpeed(speed)}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                stats.simulationSpeed === speed
                  ? "border-cyan-neon bg-cyan-neon text-navy-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-neon/50"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-5">
        <label className="block text-sm text-slate-300">
          Population
          <input
            type="range"
            min="10"
            max="1000"
            value={populationSetting}
            onChange={(event) => setPopulation(Number(event.target.value))}
            className="mt-3 w-full accent-cyan-neon"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500"><span>10</span><span>{populationSetting} agents</span><span>1000</span></div>
        </label>
        <label className="block text-sm text-slate-300">
          Mutation {Math.round(stats.mutationRate * 100)}%
          <input
            type="range"
            min="1"
            max="40"
            value={Math.round(stats.mutationRate * 100)}
            onChange={(event) => setMutation(Number(event.target.value) / 100)}
            className="mt-3 w-full accent-cyan-neon"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Generation Limit
          <input
            type="number"
            min="1"
            max="10000"
            value={generationLimit}
            onChange={(event) => setGenerationLimit(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-cyan-neon"
          />
        </label>
      </div>
      {notice ? <p className="mt-4 text-xs text-cyan-soft" role="status">{notice}</p> : null}
    </div>
  );
}
