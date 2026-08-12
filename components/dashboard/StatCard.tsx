"use client";

import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-lg p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-cyan-soft">{detail}</p> : null}
    </motion.div>
  );
}
