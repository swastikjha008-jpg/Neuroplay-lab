"use client";

import type { EnvironmentConfig } from "@/lib/types";
import { useTrainingStore } from "@/lib/store/trainingStore";

export function BestAgentPanel({ environment }: { environment: EnvironmentConfig }) {
  const stats = useTrainingStore((state) => state.stats);
  const inputs = useTrainingStore((state) => state.inputs);
  const outputs = useTrainingStore((state) => state.outputs);
  const decision = outputs.reduce((winner, signal) => (signal.value > winner.value ? signal : winner), outputs[0]);

  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-lg font-semibold text-white">Best Agent</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-slate-400">Generation</p>
          <p className="mt-1 text-xl font-semibold text-white">{stats.generation}</p>
        </div>
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-slate-400">Fitness</p>
          <p className="mt-1 text-xl font-semibold text-cyan-soft">{stats.bestScore}</p>
        </div>
      </div>
      <div className="mt-5">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500">Inputs</p>
        {inputs.map((signal) => (
          <Signal key={signal.label} label={signal.label} value={signal.value} />
        ))}
      </div>
      <div className="mt-5">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500">Outputs</p>
        {outputs.map((signal) => (
          <Signal key={signal.label} label={signal.label} value={signal.value} />
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-cyan-neon/25 bg-cyan-neon/10 p-3 text-sm">
        <span className="text-slate-400">Decision</span>
        <p className="mt-1 text-lg font-semibold text-cyan-soft">{decision?.label ?? environment.outputs[0]}</p>
      </div>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-cyan-soft">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-neon shadow-glow" style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}
