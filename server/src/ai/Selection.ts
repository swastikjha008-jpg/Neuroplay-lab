import type { Genome } from "./Genome";

export function tournamentSelection(genomes: Genome[], size = 4) {
  const candidates = Array.from({ length: size }, () => genomes[Math.floor(Math.random() * genomes.length)]);
  return candidates.sort((a, b) => b.fitness - a.fitness)[0];
}
