import type { EnvironmentConfig } from "@/lib/types";

export const environments: EnvironmentConfig[] = [
  {
    slug: "flappy",
    name: "Flappy Agent",
    shortName: "Flappy",
    description: "A drone learns timing, lift, and spatial awareness between neon data pillars.",
    difficulty: "Adaptive",
    bestScore: 1842,
    asset: "/assets/flappy-robot.svg",
    background: "/assets/flappy-background.svg",
    obstacle: "/assets/flappy-pillars.svg",
    accent: "#38d8ff",
    inputs: ["Altitude", "Velocity", "Gap distance", "Gap center"],
    outputs: ["Jump", "Hold"]
  },
  {
    slug: "dino",
    name: "Robo Runner",
    shortName: "Runner",
    description: "A biped robot evolves jump decisions while the world shifts through a day-night cycle.",
    difficulty: "Medium",
    bestScore: 3210,
    asset: "/assets/dino-robot.svg",
    background: "/assets/dino-background.svg",
    obstacle: "/assets/dino-obstacles.svg",
    accent: "#b98bff",
    inputs: ["Obstacle X", "Obstacle height", "Grounded", "Jump velocity"],
    outputs: ["Jump", "Run"]
  },
  {
    slug: "snake",
    name: "Cyber Snake",
    shortName: "Snake",
    description: "A grid-trained robotic serpent optimizes pathing toward pulsing energy cores.",
    difficulty: "Strategic",
    bestScore: 960,
    asset: "/assets/snake-head.svg",
    background: "/assets/snake-background.svg",
    obstacle: "/assets/energy-core.svg",
    accent: "#ff4fd8",
    inputs: ["Food X", "Food Y", "Wall proximity", "Body risk"],
    outputs: ["Up", "Right", "Down", "Left"]
  }
];
