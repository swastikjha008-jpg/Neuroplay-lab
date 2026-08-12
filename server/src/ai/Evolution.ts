import { Genome } from "./Genome";
import { mutateGenome } from "./Mutation";
import { tournamentSelection } from "./Selection";

export function evolve(genomes: Genome[], mutationRate: number) {
  const elite = [...genomes].sort((a, b) => b.fitness - a.fitness)[0];
  return genomes.map((_, index) => {
    if (index === 0) {
      return new Genome(elite.brain.clone());
    }
    return mutateGenome(tournamentSelection(genomes), mutationRate);
  });
}
