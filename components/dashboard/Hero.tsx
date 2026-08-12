"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="lab-grid absolute inset-0" />
      <div className="absolute inset-0">
        {Array.from({ length: 18 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-neon shadow-glow"
            style={{ left: `${8 + ((index * 17) % 88)}%`, top: `${12 + ((index * 29) % 70)}%` }}
            animate={{ y: [0, -14, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 4 + (index % 5), repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-neon/25 bg-cyan-neon/10 px-3 py-1.5 text-xs uppercase tracking-[0.28em] text-cyan-soft">
            AI evolution lab
          </div>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[0.9] tracking-normal text-white md:text-8xl">
            NEUROPLAY
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
            Train neural networks to master games through evolution.
          </p>
          <p className="mt-3 text-lg text-cyan-soft">Train. Evolve. Dominate.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#training-lab">
              <Button variant="primary">
                <Play size={16} />
                Start Training
              </Button>
            </a>
            <a href="#environments">
              <Button>
                Explore Environments
                <ArrowRight size={16} />
              </Button>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass relative min-h-[360px] overflow-hidden rounded-lg p-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,216,255,0.18),transparent_18rem)]" />
          <div className="relative grid h-full place-items-center">
            <div className="relative h-72 w-72">
              {Array.from({ length: 7 }, (_, layer) => (
                <div
                  key={layer}
                  className="absolute rounded-full border border-cyan-neon/20"
                  style={{
                    inset: `${layer * 18}px`,
                    boxShadow: `0 0 ${22 - layer}px rgba(56, 216, 255, ${0.2 - layer * 0.02})`
                  }}
                />
              ))}
              <motion.img
                src="/assets/flappy-robot.svg"
                alt="NeuroPlay drone agent"
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 cyan-glow"
                animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
