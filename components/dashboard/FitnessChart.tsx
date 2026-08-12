"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTrainingStore } from "@/lib/store/trainingStore";

export function FitnessChart() {
  const history = useTrainingStore((state) => state.history);

  return (
    <div id="analytics" className="glass rounded-lg p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Fitness History</h2>
          <p className="text-sm text-slate-400">Best and average fitness across generations.</p>
        </div>
        <span className="rounded-full border border-cyan-neon/25 bg-cyan-neon/10 px-3 py-1 text-xs text-cyan-soft">
          Live
        </span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="bestFitness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38d8ff" stopOpacity={0.42} />
                <stop offset="95%" stopColor="#38d8ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="avgFitness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b98bff" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#b98bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(127,233,255,0.12)" vertical={false} />
            <XAxis dataKey="generation" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(8, 11, 34, 0.94)",
                border: "1px solid rgba(56,216,255,0.25)",
                borderRadius: 8,
                color: "#eafcff"
              }}
            />
            <Area type="monotone" dataKey="best" stroke="#38d8ff" fill="url(#bestFitness)" strokeWidth={2.5} />
            <Area type="monotone" dataKey="average" stroke="#b98bff" fill="url(#avgFitness)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
