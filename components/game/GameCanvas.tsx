"use client";

import { useEffect, useRef } from "react";
import type { EnvironmentConfig } from "@/lib/types";
import { useTrainingStore } from "@/lib/store/trainingStore";

type FlappyRender = { kind: "flappy"; y: number; velocity: number; score: number; bird: { x: number; radius: number }; pipeWidth: number; pipeGapHalf: number; pipes: Array<{ x: number; gap: number; passed: boolean }> };
type RunnerRender = { kind: "runner"; height: number; grounded: boolean; score: number; ground: number; robot: { x: number; width: number; height: number }; obstacle: { x: number; width: number; height: number }; phase: number };
type SnakeRender = { kind: "snake"; body: Array<[number, number]>; food: [number, number]; score: number };

export function GameCanvas({ environment }: { environment: EnvironmentConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const render = useTrainingStore((state) => state.render);
  const stats = useTrainingStore((state) => state.stats);
  const currentScore = useTrainingStore((state) => state.currentScore);
  const renderRef = useRef(render);
  const statsRef = useRef(stats);
  const scoreRef = useRef(currentScore);
  renderRef.current = render;
  statsRef.current = stats;
  scoreRef.current = currentScore;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const background = new Image();
    const agent = new Image();
    const obstacle = new Image();
    const snakeBody = new Image();
    background.src = environment.background;
    agent.src = environment.asset;
    obstacle.src = environment.obstacle;
    snakeBody.src = "/assets/snake-body.svg";

    let frame = 0;
    let animation = 0;
    const draw = () => {
      frame += 1;
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#080b22";
      context.fillRect(0, 0, width, height);
      drawBackground(context, background, frame, width, height);

      if (environment.slug === "snake") drawSnake(context, agent, snakeBody, obstacle, renderRef.current as unknown as SnakeRender, frame, width, height);
      else if (environment.slug === "dino") drawRunner(context, agent, obstacle, renderRef.current as unknown as RunnerRender, width, height);
      else drawFlappy(context, agent, obstacle, renderRef.current as unknown as FlappyRender, width, height);

      drawHud(context, environment, statsRef.current, scoreRef.current, width);
      animation = window.requestAnimationFrame(draw);
    };
    draw();
    return () => window.cancelAnimationFrame(animation);
  }, [environment]);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={500}
      aria-label={`${environment.name} training simulation`}
      className="game-canvas aspect-[1.8/1] w-full rounded-lg border border-cyan-neon/20 bg-navy-900 shadow-panel"
    />
  );
}

function drawBackground(context: CanvasRenderingContext2D, background: HTMLImageElement, frame: number, width: number, height: number) {
  const bgOffset = (frame * 0.45) % width;
  if (background.complete && background.naturalWidth > 0) {
    context.drawImage(background, -bgOffset, 0, width, height);
    context.drawImage(background, width - bgOffset, 0, width, height);
  }
  context.save();
  context.globalCompositeOperation = "lighter";
  context.fillStyle = "rgba(56,216,255,0.18)";
  for (let index = 0; index < 24; index += 1) {
    const x = (index * 91 + frame * (0.8 + (index % 3) * 0.2)) % width;
    const y = 34 + ((index * 47) % (height - 80));
    context.beginPath();
    context.arc(x, y, 1.5 + (index % 3), 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawFlappy(context: CanvasRenderingContext2D, agent: HTMLImageElement, obstacle: HTMLImageElement, state: FlappyRender, width: number, height: number) {
  const render = state?.kind === "flappy" ? state : { kind: "flappy" as const, y: 0.5, velocity: 0, score: 0, bird: { x: 0.24, radius: 0.055 }, pipeWidth: 0.13, pipeGapHalf: 0.14, pipes: [] };
  render.pipes.forEach((pipe) => {
    const x = pipe.x * width;
    const gapCenter = pipe.gap * height;
    const gapHeight = render.pipeGapHalf * height * 2;
    if (obstacle.complete && obstacle.naturalWidth > 0) {
      const pipeWidth = render.pipeWidth * width;
      const topHeight = Math.max(0, gapCenter - gapHeight / 2);
      const bottomY = gapCenter + gapHeight / 2;
      const bottomHeight = Math.max(0, height - bottomY);
      // The supplied sprite contains both halves of one pipe pair. Crop each half
      // so every simulation pipe has one clear top and bottom collision surface.
      context.drawImage(obstacle, 0, 0, 200, 225, x, 0, pipeWidth, topHeight);
      context.drawImage(obstacle, 0, 375, 200, 225, x, bottomY, pipeWidth, bottomHeight);
    }
  });
  if (agent.complete && agent.naturalWidth > 0) {
    context.save();
    context.translate(render.bird.x * width, render.y * height);
    context.rotate(Math.max(-0.3, Math.min(0.3, render.velocity * 5)));
    const diameter = render.bird.radius * width * 2;
    context.drawImage(agent, -diameter / 2, -diameter / 2, diameter, diameter);
    context.restore();
  }
}

function drawRunner(context: CanvasRenderingContext2D, agent: HTMLImageElement, obstacle: HTMLImageElement, state: RunnerRender, width: number, height: number) {
  const render = state?.kind === "runner" ? state : { kind: "runner" as const, height: 0, grounded: true, score: 0, ground: 0.82, robot: { x: 0.09, width: 0.165, height: 0.27 }, obstacle: { x: 1, width: 0.135, height: 0.19 }, phase: 0 };
  drawRunnerCycle(context, render.phase, width, height);
  const groundY = render.ground * height;
  if (agent.complete && agent.naturalWidth > 0) context.drawImage(agent, render.robot.x * width, groundY - (render.height + render.robot.height) * height, render.robot.width * width, render.robot.height * height);
  if (obstacle.complete && obstacle.naturalWidth > 0) {
    // The asset sheet contains several prop variants. The leading crystal cluster
    // is the single ground obstacle used by the Runner environment.
    context.drawImage(
      obstacle,
      0,
      70,
      110,
      115,
      render.obstacle.x * width,
      groundY - render.obstacle.height * height,
      render.obstacle.width * width,
      render.obstacle.height * height
    );
  }
  context.strokeStyle = "rgba(56,216,255,0.65)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, groundY);
  context.lineTo(width, groundY);
  context.stroke();
}

function drawRunnerCycle(context: CanvasRenderingContext2D, phase: number, width: number, height: number) {
  const tint = phase < 0.25
    ? "rgba(255, 170, 82, 0.09)"
    : phase < 0.5
      ? "rgba(255, 255, 255, 0)"
      : phase < 0.75
        ? "rgba(255, 92, 88, 0.14)"
        : "rgba(13, 19, 66, 0.3)";
  context.fillStyle = tint;
  context.fillRect(0, 0, width, height);
}

function drawSnake(context: CanvasRenderingContext2D, head: HTMLImageElement, bodyAsset: HTMLImageElement, core: HTMLImageElement, state: SnakeRender, frame: number, width: number, height: number) {
  const render = state?.kind === "snake" ? state : { kind: "snake" as const, body: [], food: [11, 4] as [number, number], score: 0 };
  const cellWidth = width / 18;
  const cellHeight = height / 10;
  render.body.forEach(([x, y], index) => {
    const image = index === 0 ? head : bodyAsset;
    if (image.complete && image.naturalWidth > 0) context.drawImage(image, x * cellWidth + 3, y * cellHeight + 3, cellWidth - 6, cellHeight - 6);
  });
  if (core.complete && core.naturalWidth > 0) {
    const pulse = 42 + Math.sin(frame / 18) * 6;
    context.drawImage(core, render.food[0] * cellWidth + cellWidth / 2 - pulse / 2, render.food[1] * cellHeight + cellHeight / 2 - pulse / 2, pulse, pulse);
  }
}

function drawHud(context: CanvasRenderingContext2D, environment: EnvironmentConfig, stats: { generation?: number; running?: boolean }, currentScore: number, width: number) {
  context.save();
  context.fillStyle = "rgba(8, 11, 34, 0.68)";
  context.strokeStyle = "rgba(56,216,255,0.45)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.roundRect(20, 20, 150, 34, 17);
  context.fill();
  context.stroke();
  context.fillStyle = "#7fe9ff";
  context.font = "14px Space Grotesk, sans-serif";
  context.textAlign = "center";
  context.fillText("NEUROPLAY", 95, 43);
  context.textAlign = "right";
  context.font = "700 20px Space Grotesk, sans-serif";
  context.fillStyle = "#eafcff";
  context.fillText(`${environment.shortName.toUpperCase()}  ${Math.round(currentScore)}`, width - 22, 42);
  context.font = "12px Space Grotesk, sans-serif";
  context.fillStyle = stats.running ? "#7fe9ff" : "#94a3b8";
  context.fillText(`${stats.running ? "LIVE" : "PAUSED"}  ·  GEN ${stats.generation ?? 1}`, width - 22, 62);
  context.restore();
}
