"use client";

import { useEffect } from "react";
import { Activity, Cpu, Gauge, Radio, Timer, Zap } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/dashboard/Hero";
import { StatCard } from "@/components/dashboard/StatCard";
import { FitnessChart } from "@/components/dashboard/FitnessChart";
import { EnvironmentCards } from "@/components/dashboard/EnvironmentCards";
import { NeuralNetworkPanel } from "@/components/game/NeuralNetworkPanel";
import { useTrainingStore } from "@/lib/store/trainingStore";
import { formatElapsed } from "@/lib/utils";

export function Dashboard() {
  const stats = useTrainingStore((state) => state.stats);
  const connect = useTrainingStore((state) => state.connect);
  const disconnect = useTrainingStore((state) => state.disconnect);

  useEffect(() => {
    connect("flappy");
    return disconnect;
  }, [connect, disconnect]);

  const cards = [
    { label: "Generation", value: stats.generation.toString(), detail: "elite preserved", icon: Activity },
    { label: "Population", value: stats.population.toString(), detail: `${stats.alive} alive`, icon: Cpu },
    { label: "Best Score", value: stats.bestScore.toLocaleString(), detail: "highest active", icon: Zap },
    { label: "Average Fitness", value: stats.averageFitness.toLocaleString(), detail: "rolling mean", icon: Radio },
    { label: "Mutation Rate", value: `${Math.round(stats.mutationRate * 100)}%`, detail: "current setting", icon: Gauge },
    { label: "Elapsed", value: formatElapsed(stats.elapsedSeconds), detail: `${stats.fps} FPS`, icon: Timer }
  ];

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="training-lab" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">Training Lab</h2>
              <p className="mt-2 text-slate-400">Realtime neuroevolution telemetry and model behavior.</p>
            </div>
            <div className="rounded-full border border-cyan-neon/25 bg-cyan-neon/10 px-4 py-2 text-sm text-cyan-soft">
              Streaming simulation
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {cards.map(({ icon: Icon, ...card }) => (
              <div key={card.label} className="relative">
                <Icon className="absolute right-4 top-4 z-10 text-cyan-soft/70" size={18} />
                <StatCard {...card} />
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <FitnessChart />
            <NeuralNetworkPanel />
          </div>
        </section>
        <EnvironmentCards />
      </main>
    </>
  );
}
