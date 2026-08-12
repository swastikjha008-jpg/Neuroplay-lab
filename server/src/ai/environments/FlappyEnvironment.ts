import { BaseToyEnvironment } from "./BaseToyEnvironment";

export class FlappyEnvironment extends BaseToyEnvironment {
  private readonly birdX = 0.24;
  private readonly birdRadius = 0.055;
  private readonly pipeWidth = 0.13;
  private readonly pipeGapHalf = 0.14;
  private readonly pipeSpacing = 0.68;
  private y = 0.5;
  private velocity = 0;
  private score = 0;
  private flapCooldown = 0;
  private pipes: Array<{ x: number; gap: number; passed: boolean }> = [];

  reset() {
    this.y = 0.5;
    this.velocity = 0;
    this.score = 0;
    this.flapCooldown = 0;
    this.pipes = [
      { x: 1.15, gap: 0.52, passed: false },
      { x: 1.15 + this.pipeSpacing, gap: 0.43, passed: false }
    ];
    return super.reset();
  }

  getState() {
    const pipe = this.pipes.find((item) => item.x + this.pipeWidth >= this.birdX) ?? this.pipes[0];
    return [this.y, Math.max(0, Math.min(1, (this.velocity + 0.06) / 0.12)), Math.max(0, Math.min(1, pipe.x - this.birdX + 0.5)), pipe.gap];
  }

  protected evaluate(action: number) {
    if (this.flapCooldown > 0) this.flapCooldown -= 1;
    if (action > 0.5 && this.flapCooldown === 0) {
      this.velocity = -0.036;
      this.flapCooldown = 5;
    }
    this.velocity += 0.0031;
    this.y += this.velocity;
    this.velocity *= 0.995;
    let passedPipe = false;
    this.pipes.forEach((pipe) => {
      pipe.x -= 0.007;
      if (!pipe.passed && pipe.x + this.pipeWidth < this.birdX - this.birdRadius) {
        pipe.passed = true;
        this.score += 1;
        passedPipe = true;
      }
    });
    while (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < 1.4) {
      const previous = this.pipes[this.pipes.length - 1];
      this.pipes.push({ x: previous ? previous.x + this.pipeSpacing : 1.15, gap: 0.3 + Math.random() * 0.4, passed: false });
    }
    this.pipes = this.pipes.filter((pipe) => pipe.x > -0.2);
    const pipe = this.pipes.find((item) => item.x + this.pipeWidth >= this.birdX - this.birdRadius) ?? this.pipes[0];
    const inPipe = pipe && pipe.x < this.birdX + this.birdRadius && pipe.x + this.pipeWidth > this.birdX - this.birdRadius;
    if (this.y < this.birdRadius || this.y > 1 - this.birdRadius || (inPipe && Math.abs(this.y - pipe.gap) > this.pipeGapHalf)) {
      return -10;
    }
    return 0.08 + Math.max(0, 0.05 - Math.abs(this.y - pipe.gap)) * 0.6 + (passedPipe ? 8 : 0);
  }

  getRenderState() {
    return {
      kind: "flappy" as const,
      y: this.y,
      velocity: this.velocity,
      score: this.score,
      bird: { x: this.birdX, radius: this.birdRadius },
      pipeWidth: this.pipeWidth,
      pipeGapHalf: this.pipeGapHalf,
      pipes: this.pipes.map((pipe) => ({ ...pipe }))
    };
  }
}
