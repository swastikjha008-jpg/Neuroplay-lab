import type { Environment, StepResult } from "../Environment";

export abstract class BaseToyEnvironment implements Environment<number, number[]> {
  protected frame = 0;
  protected reward = 0;
  protected done = false;

  reset() {
    this.frame = 0;
    this.reward = 0;
    this.done = false;
    return this.getState();
  }

  step(action: number): StepResult {
    if (this.done) {
      return { state: this.getState(), reward: this.reward, done: true };
    }
    this.frame += 1;
    this.reward = this.evaluate(action);
    this.done = this.frame > 1200 || this.reward < -1;
    return { state: this.getState(), reward: this.reward, done: this.done };
  }

  getReward() {
    return this.reward;
  }

  isDone() {
    return this.done;
  }

  abstract getState(): number[];
  protected abstract evaluate(action: number): number;
}
