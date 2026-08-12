export type EnvironmentStep<Action = number, State = number[]> = {
  state: State;
  reward: number;
  done: boolean;
};

export interface Environment<Action = number, State = number[]> {
  id: string;
  reset(): State;
  step(action: Action): EnvironmentStep<Action, State>;
  getState(): State;
  getReward(): number;
  isDone(): boolean;
}
