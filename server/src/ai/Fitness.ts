export function scoreFitness(score: number, survivalFrames: number, penalty = 0) {
  return score * 100 + survivalFrames * 0.1 - penalty;
}
