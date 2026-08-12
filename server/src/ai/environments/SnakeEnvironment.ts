import { BaseToyEnvironment } from "./BaseToyEnvironment";

export class SnakeEnvironment extends BaseToyEnvironment {
  private readonly movementCadence = 4;
  private x = 5;
  private y = 5;
  private direction = 1;
  private body: Array<[number, number]> = [];
  private foodX = 11;
  private foodY = 4;
  private score = 0;
  private previousDistance = 0;

  reset() {
    this.x = 5;
    this.y = 5;
    this.direction = 1;
    this.body = [[5, 5], [4, 5], [3, 5]];
    this.foodX = 11;
    this.foodY = 4;
    this.score = 0;
    this.previousDistance = 7;
    return super.reset();
  }

  getState() {
    const next = this.nextCell(this.direction);
    const wallClearance = Math.min(this.x, 17 - this.x, this.y, 9 - this.y) / 9;
    const bodyRisk = this.wouldCollide(next) ? 1 : 0;
    return [Math.max(-1, Math.min(1, (this.foodX - this.x) / 18)), Math.max(-1, Math.min(1, (this.foodY - this.y) / 10)), wallClearance, bodyRisk];
  }

  protected evaluate(action: number) {
    const reverse = (action + 2) % 4 === this.direction;
    this.direction = reverse ? this.direction : action;
    if (this.frame % this.movementCadence !== 0) return 0.02;

    const next = this.nextCell(this.direction);
    if (this.wouldCollide(next)) {
      return -10;
    }
    this.x = next[0];
    this.y = next[1];
    this.body.unshift(next);
    const nextDistance = Math.abs(this.foodX - this.x) + Math.abs(this.foodY - this.y);
    if (nextDistance === 0) {
      this.score += 1;
      this.spawnFood();
      this.previousDistance = Math.abs(this.foodX - this.x) + Math.abs(this.foodY - this.y);
      return 12;
    }
    this.body.pop();
    const improvement = this.previousDistance - nextDistance;
    this.previousDistance = nextDistance;
    if (this.frame > 900) {
      return -2;
    }
    return improvement > 0 ? 0.8 : -0.15;
  }

  private spawnFood() {
    do {
      this.foodX = Math.floor(Math.random() * 18);
      this.foodY = Math.floor(Math.random() * 10);
    } while (this.body.some(([x, y]) => x === this.foodX && y === this.foodY));
  }

  private nextCell(direction: number): [number, number] {
    const next = [this.x, this.y] as [number, number];
    if (direction === 0) next[1] -= 1;
    if (direction === 1) next[0] += 1;
    if (direction === 2) next[1] += 1;
    if (direction === 3) next[0] -= 1;
    return next;
  }

  private wouldCollide([x, y]: [number, number]) {
    return x < 0 || y < 0 || x > 17 || y > 9 || this.body.some(([bodyX, bodyY]) => bodyX === x && bodyY === y);
  }

  getRenderState() {
    return { kind: "snake" as const, body: this.body.map(([x, y]) => [x, y] as [number, number]), food: [this.foodX, this.foodY] as [number, number], score: this.score };
  }
}
