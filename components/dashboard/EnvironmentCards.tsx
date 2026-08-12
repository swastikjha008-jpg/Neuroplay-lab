"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { environments } from "@/config/environments";
import { Button } from "@/components/ui/Button";

export function EnvironmentCards() {
  return (
    <section id="environments" className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-white">Environments</h2>
          <p className="mt-2 max-w-2xl text-slate-400">Three training worlds, one shared neuroevolution engine.</p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {environments.map((environment) => (
          <motion.article
            key={environment.slug}
            whileHover={{ y: -6 }}
            className="glass overflow-hidden rounded-lg"
          >
            <div
              className="relative h-48 overflow-hidden border-b border-cyan-neon/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${environment.background})` }}
            >
              <div className="absolute inset-0 bg-navy-950/20" />
              <motion.img
                src={environment.asset}
                alt=""
                className="absolute left-8 top-9 h-28 w-28 cyan-glow"
                animate={{ y: [-4, 6, -4] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <Image
                src={environment.obstacle}
                alt=""
                width={96}
                height={96}
                unoptimized
                className="absolute bottom-4 right-8 h-24 w-24 object-contain opacity-90 cyan-glow"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{environment.name}</h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  {environment.difficulty}
                </span>
              </div>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{environment.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Best score</p>
                  <p className="text-lg font-semibold text-cyan-soft">{environment.bestScore.toLocaleString()}</p>
                </div>
                <Link href={`/games/${environment.slug}`}>
                  <Button variant="primary">
                    <Play size={15} />
                    Train
                  </Button>
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
