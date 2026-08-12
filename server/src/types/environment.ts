import type { Environment } from "../ai/Environment";

export type EnvironmentDefinition = {
  id: string;
  name: string;
  inputs: number;
  outputs: number;
  create: () => Environment;
};
