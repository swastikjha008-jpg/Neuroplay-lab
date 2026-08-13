<div align="center">

# ⚡ NEUROPLAY

### AI Evolution Lab — Train neural networks to master games through evolution

**Train. Evolve. Dominate.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-0A0E1A?style=for-the-badge&logo=next.js&logoColor=00D9FF)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-0A0E1A?style=for-the-badge&logo=react&logoColor=00D9FF)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-0A0E1A?style=for-the-badge&logo=typescript&logoColor=00D9FF)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-0A0E1A?style=for-the-badge&logo=node.js&logoColor=00D9FF)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-0A0E1A?style=for-the-badge&logo=socket.io&logoColor=00D9FF)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0A0E1A?style=for-the-badge&logo=tailwindcss&logoColor=00D9FF)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-0A0E1A?style=for-the-badge&logo=docker&logoColor=00D9FF)](https://www.docker.com/)
[![npm](https://img.shields.io/badge/npm-0A0E1A?style=for-the-badge&logo=npm&logoColor=00D9FF)](https://www.npmjs.com/)
[![ESLint](https://img.shields.io/badge/ESLint-0A0E1A?style=for-the-badge&logo=eslint&logoColor=00D9FF)](https://eslint.org/)
[![Git](https://img.shields.io/badge/Git-0A0E1A?style=for-the-badge&logo=git&logoColor=00D9FF)](https://git-scm.com/)

</div>

<br/>

## Overview

NeuroPlay is an AI playground where neural networks learn to master games from scratch using **neuroevolution** — genetic algorithms driving the evolution of neural network agents. Instead of being hand-coded or trained through gradient descent, each agent's brain is a small neural network whose weights are evolved: populations of agents compete inside a game environment, the fittest are selected, their brains are mutated and recombined, and the next generation starts a little smarter than the last.

The backend simulation is authoritative. It owns every environment, steps every agent forward, evolves every population, and streams live training state to the frontend over **Socket.IO**. The frontend is a pure viewer for that state — it renders canvas frames, fitness curves, and generation stats exactly as reported, and never invents or interpolates progress data on its own. This split keeps the simulation deterministic and trustworthy: what you see on screen is exactly what the backend computed, frame for frame.

---

## 🧠 How Neuroevolution Works Here

Each generation follows the same evolutionary loop:

1. **Population** — a batch of agents is spawned, each with a randomly initialized (or inherited) neural network brain.
2. **Simulation** — every agent plays the environment simultaneously; the backend steps physics/game logic and feeds each agent's observations into its network.
3. **Fitness scoring** — each agent's performance (distance survived, score, time alive, etc. depending on the environment) is tracked as its fitness.
4. **Selection** — the best-performing agents from the generation are chosen to become parents.
5. **Mutation & reproduction** — parent brains are mutated (and optionally combined) to produce the next generation's population.
6. **Reset & repeat** — the environment resets, the new population takes over, and the cycle continues until the generation limit or a manual stop.

This is why changing configuration mid-run (like population size) forces a reset — the population and agent list are structurally tied to the run in progress and can't be resized in place.

---

## ✨ Features

- Connect to any of the available simulation environments
- Configure population size, mutation rate, and generation limit before a run
- Start, pause, and reset training on demand, mid-run
- Adjustable live simulation speed for fast-forwarding through generations
- Save, load, and replay the best-performing brain from a run
- Live training snapshots streamed continuously over Socket.IO
- Real-time status notices pushed from the backend (connection state, run state, errors)

---

## 🖥️ Frontend Screens

### Dashboard
The landing surface after connecting — introduces every available simulation environment and surfaces live, high-level training information at a glance, so you can see run status without diving into a specific environment's workspace.

### Game Lab
Each environment gets its own full training workspace, built around six coordinated panels:

- **Live canvas simulation** — real-time rendering of every agent in the current generation
- **Training controls** — start, pause, reset, speed, and configuration in one place
- **Fitness stats** — best, average, and worst fitness for the current and past generations
- **Generation history** — a running log of how the population has improved over time
- **Best agent panel** — spotlights the top performer of the current run
- **Neural network graph** — a live visualization of the best agent's brain, showing its layers and activations
- **Fullscreen mode** — expands the canvas simulation for a distraction-free view

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js (React) |
| Language | TypeScript, end to end |
| Styling | Tailwind CSS |
| Realtime transport | Socket.IO (frontend ⇄ backend) |
| Backend runtime | Node.js |
| Containerization | Docker / Docker Compose |
| Package manager | npm |
| Linting | ESLint |
| Version control | Git |

---

## 🚀 Getting Started

```bash
docker compose up --build
```

This builds and starts the frontend and the backend training session together, wired up over Socket.IO out of the box — no separate setup steps required.

---

## ❓ FAQ

**Why does training reset when I change the population size?**
This is expected behavior. `setPopulation()` clamps the new size and calls `reset()`, because the population and agent list have to be recreated from scratch — you can't resize a running population in place without invalidating the generation currently in progress.

**Why does my saved brain disappear after a restart?**
This is expected in the current implementation — brain storage is **in-memory only**, held inside the running backend process. Saved brains remain available for as long as that process keeps running, but a restart clears them. There's no database layer backing storage yet, so treat "save" as session-scoped rather than permanent.

---

## ✅ Quality Checks

Run these before publishing changes:

```bash
npm run typecheck
npm run lint
npm run server:build
npm run build
```

> There is no dedicated test script in the current `package.json` yet — these four commands are the full verification pass for now.

---

## 🤝 Contributing

Recommended flow:

```bash
git checkout -b feature/your-change
npm install
npm run typecheck
npm run lint
npm run server:build
npm run build
```

Guidelines:

- Keep the backend simulation authoritative — the frontend should never compute or guess fitness/progress data itself.
- Keep environments decoupled from evolution internals, so new games can be added without touching the genetic algorithm core.
- Do not hard-code frontend telemetry that should come from `TrainingSession`.
- Keep environment state vectors numeric and documented, so any network can consume them.
- Add input/output labels when adding a network layout, so the neural network graph stays readable.
- Keep render-state fields aligned with environment collision geometry, so the canvas always matches simulation truth.
- Update this README when commands, routes, events, env vars, or deployment behavior change.

Pull requests should describe:

- What changed
- Which environment or layer is affected
- How the AI/reward behavior changed, if applicable
- Which checks were run

---

## 📝 Notes

- Brain storage is in memory. Saved brains remain available while the backend process is running, and are lost on restart.
- The backend is authoritative for training. The frontend does not invent fitness or progress data — it only renders what's streamed to it.
- The app is structured so persistent database storage could be added later without changing the main UI flow.
- The included Docker setup is suitable for local deployment and as a base for cloud deployment.

---

## 📄 License

No `LICENSE` file is present in the repository, and `package.json` does not declare a license.
Choose and add a license before publishing NeuroPlay as an open-source project.

---

## 🙌 Credits

The repository contains custom SVG assets under `public/assets`. No separate third-party asset credits file or contributor list is present in the current project.

<div align="center">
<br/>

Made with ⚡ by [swastikjha008-jpg](https://github.com/swastikjha008-jpg)

</div>
