"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import type { EnvironmentConfig } from "@/lib/types";
import { Nav } from "@/components/layout/Nav";
import { Button } from "@/components/ui/Button";
import { GameCanvas } from "@/components/game/GameCanvas";
import { ControlsPanel } from "@/components/game/ControlsPanel";
import { LiveStats } from "@/components/game/LiveStats";
import { BestAgentPanel } from "@/components/game/BestAgentPanel";
import { NeuralNetworkPanel } from "@/components/game/NeuralNetworkPanel";
import { FitnessChart } from "@/components/dashboard/FitnessChart";
import { useTrainingStore } from "@/lib/store/trainingStore";

export function GameLab({ environment }: { environment: EnvironmentConfig }) {
  const setEnvironment = useTrainingStore((state) => state.setEnvironment);
  const connect = useTrainingStore((state) => state.connect);
  const disconnect = useTrainingStore((state) => state.disconnect);
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnvironment(environment.slug);
    connect(environment.slug);
    return disconnect;
  }, [connect, disconnect, environment.slug, setEnvironment]);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === fullscreenRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    window.addEventListener("resize", syncFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      window.removeEventListener("resize", syncFullscreen);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await fullscreenRef.current?.requestFullscreen();
      }
      setFullscreen(document.fullscreenElement === fullscreenRef.current);
      window.setTimeout(syncFullscreenState, 100);
    } catch {
      setFullscreen(false);
    }
  };

  const syncFullscreenState = () => setFullscreen(document.fullscreenElement === fullscreenRef.current);

  return (
    <>
      <Nav />
      <main ref={fullscreenRef} className="mx-auto max-w-7xl px-5 py-8 lg:px-8 fullscreen-shell">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-cyan-soft hover:text-white">
              NeuroPlay / Environments
            </Link>
            <h1 className="mt-2 text-4xl font-semibold text-white">{environment.name}</h1>
            <p className="mt-2 max-w-2xl text-slate-400">{environment.description}</p>
          </div>
          <Button onClick={toggleFullscreen} aria-pressed={fullscreen}>
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <GameCanvas environment={environment} />
            <div className="grid gap-5 xl:grid-cols-2">
              <NeuralNetworkPanel />
              <FitnessChart />
            </div>
          </motion.section>
          <aside className="space-y-5">
            <ControlsPanel />
            <LiveStats />
            <BestAgentPanel environment={environment} />
          </aside>
        </div>
      </main>
    </>
  );
}
