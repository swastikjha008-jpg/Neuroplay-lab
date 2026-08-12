"use client";

import Link from "next/link";
import { Github, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const links = ["Home", "Training Lab", "Environments", "Analytics", "Saved Models", "Settings"];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-cyan-neon/10 bg-navy-950/72 backdrop-blur-2xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-neon/30 bg-cyan-neon/10 text-cyan-soft shadow-glow">
            <Sparkles size={18} />
          </span>
          <span className="text-lg font-semibold tracking-wide">NeuroPlay</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
          {links.map((link) => (
            <a key={link} href={link === "Home" ? "/" : `#${link.toLowerCase().replaceAll(" ", "-")}`} className="transition hover:text-cyan-soft">
              {link}
            </a>
          ))}
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-neon/25 bg-cyan-neon/10 px-3 py-2 text-sm text-cyan-soft transition hover:border-cyan-neon/60 hover:bg-cyan-neon/15"
        >
          <Github size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        <button aria-label="Open settings" className="ml-2 rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden">
          <Settings size={16} />
        </button>
      </nav>
    </motion.header>
  );
}
