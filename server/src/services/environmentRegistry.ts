import type { EnvironmentDefinition } from "../types/environment";
import { FlappyEnvironment } from "../ai/environments/FlappyEnvironment";
import { RunnerEnvironment } from "../ai/environments/RunnerEnvironment";
import { SnakeEnvironment } from "../ai/environments/SnakeEnvironment";

const definitions: EnvironmentDefinition[] = [
  { id: "flappy", name: "Flappy Agent", inputs: 4, outputs: 2, create: () => new FlappyEnvironment() },
  { id: "dino", name: "Robo Runner", inputs: 4, outputs: 2, create: () => new RunnerEnvironment() },
  { id: "snake", name: "Cyber Snake", inputs: 4, outputs: 4, create: () => new SnakeEnvironment() }
];

export const environmentRegistry = {
  list() {
    return definitions.map(({ create: _create, ...definition }) => definition);
  },
  get(id: string) {
    return definitions.find((definition) => definition.id === id);
  }
};
