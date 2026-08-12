import { randomUUID } from "node:crypto";

type StoredBrain = {
  id: string;
  createdAt: string;
  payload: unknown;
};

class BrainStorage {
  private brains: StoredBrain[] = [];

  list() {
    return this.brains;
  }

  save(payload: unknown) {
    const brain = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      payload
    };
    this.brains.push(brain);
    return brain;
  }

  latest(environment?: string) {
    return [...this.brains]
      .reverse()
      .find((brain) => !environment || (brain.payload as { environment?: string })?.environment === environment);
  }
}

export const brainStorage = new BrainStorage();
