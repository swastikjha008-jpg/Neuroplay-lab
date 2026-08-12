import { BaseToyEnvironment } from "./BaseToyEnvironment";

export class RunnerEnvironment extends BaseToyEnvironment {
  private readonly ground = 0.82;
  private readonly robot = { x: 0.09, width: 0.165, height: 0.27 };
  private readonly obstacleSize = { width: 0.135, height: 0.19 };
  private grounded = true;
  private jumpVelocity = 0;
  private height = 0;
  private score = 0;
  private obstacle = { x: 1.2, ...this.obstacleSize };

  reset() {
    this.grounded = true;
    this.jumpVelocity = 0;
    this.height = 0;
    this.score = 0;
    this.obstacle = { x: 1.2, ...this.obstacleSize };
    return super.reset();
  }

  getState() {
    return [Math.max(0, Math.min(1, this.obstacle.x - this.robot.x)), this.obstacle.height, this.grounded ? 1 : 0, Math.max(0, Math.min(1, (this.jumpVelocity + 0.06) / 0.12))];
  }

  protected evaluate(action: number) {
    if (this.grounded && action > 0.5) {
      this.jumpVelocity = 0.046;
      this.grounded = false;
    }
    if (!this.grounded) {
      this.height += this.jumpVelocity;
      this.jumpVelocity -= 0.004;
      if (this.height <= 0) {
        this.height = 0;
        this.grounded = true;
      }
    }
    this.obstacle.x -= 0.009;
    const horizontalOverlap = this.obstacle.x < this.robot.x + this.robot.width && this.obstacle.x + this.obstacle.width > this.robot.x;
    const robotBottom = this.ground - this.height;
    const obstacleTop = this.ground - this.obstacle.height;
    if (horizontalOverlap && robotBottom > obstacleTop) {
      return -10;
    }
    if (this.obstacle.x + this.obstacle.width < this.robot.x) {
      this.score += 1;
      this.obstacle = { x: 1.2, ...this.obstacleSize };
      return 5;
    }
    return 0.08;
  }

  getRenderState() {
    return {
      kind: "runner" as const,
      height: this.height,
      grounded: this.grounded,
      score: this.score,
      ground: this.ground,
      robot: { ...this.robot },
      obstacle: { ...this.obstacle },
      phase: (this.frame % 2400) / 2400
    };
  }
}
