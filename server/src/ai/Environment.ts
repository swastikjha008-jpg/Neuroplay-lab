export type StepResult<State = number[]> = {
  state: State;
  reward: number;
  done: boolean;
};

export interface Environment<Action = number, State = number[]> {
  reset(): State;
  step(action: Action): StepResult<State>;
  getState(): State;
  getReward(): number;
  isDone(): boolean;
}
