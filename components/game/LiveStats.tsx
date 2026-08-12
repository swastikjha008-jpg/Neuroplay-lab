"use client";

import { useTrainingStore } from "@/lib/store/trainingStore";
import { formatElapsed } from "@/lib/utils";

export function LiveStats() {
  const stats = useTrainingStore((state) => state.stats);
  const rows = [
    ["Generation", stats.generation],
    ["Population", stats.population],
    ["Alive Agents", stats.alive],
    ["Dead Agents", stats.population - stats.alive],
    ["Current Best", stats.bestScore],
    ["Average Score", stats.averageFitness],
    ["Highest Ever", stats.highestEver],
    ["Mutation Rate", `${Math.round(stats.mutationRate * 100)}%`],
    ["Elapsed Time", formatElapsed(stats.elapsedSeconds)],
    ["Training Speed", `${stats.simulationSpeed}x`]
  ];

  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-lg font-semibold text-white">Live Stats</h2>
      <div className="mt-4 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-white/5 py-2 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="font-semibold text-cyan-soft">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
