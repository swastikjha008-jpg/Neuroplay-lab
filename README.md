<div align="center">

# ⚡ NEUROPLAY

### AI Evolution Lab — Train neural networks to master games through evolution

**Train. Evolve. Dominate.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-0A0E1A?style=for-the-badge&logo=next.js&logoColor=00D9FF)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-0A0E1A?style=for-the-badge&logo=typescript&logoColor=00D9FF)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-0A0E1A?style=for-the-badge&logo=node.js&logoColor=00D9FF)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-0A0E1A?style=for-the-badge&logo=socket.io&logoColor=00D9FF)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0A0E1A?style=for-the-badge&logo=tailwindcss&logoColor=00D9FF)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-0A0E1A?style=for-the-badge&logo=docker&logoColor=00D9FF)](https://www.docker.com/)

</div>

<br/>

## Overview

NeuroPlay is an AI playground where neural networks learn to master games from scratch using **neuroevolution** — genetic algorithms driving the evolution of neural network agents. Watch populations of agents compete, mutate, and improve generation over generation, live, in the browser.

The backend simulation is authoritative: it owns every environment, evolves every population, and streams live training state to the frontend over **Socket.IO**. The frontend never invents fitness or progress data — it only renders what the backend reports.

---

## ✨ Features

- Connect to a selected environment
- Configure population size, mutation rate, and generation limit
- Start, pause, and reset training on demand
- Adjustable live simulation speed
- Save, load, and replay the best-performing brain
- Live training snapshots streamed over Socket.IO
- Real-time status notices from the backend

---

## 🖥️ Frontend Screens

### Dashboard
Introduces the available simulation environments and surfaces live, high-level training information at a glance.

### Game Lab
Each environment gets a full training workspace:

- Live canvas simulation
- Training controls
- Fitness stats
- Generation history
- Best agent panel
- Neural network graph
- Fullscreen mode

---

## 🚀 Getting Started

```bash
docker compose up --build
```

This spins up the frontend and the backend training session together, connected over Socket.IO.

---

## ❓ FAQ

**Why does training reset when I change the population size?**
This is expected behavior. `setPopulation()` clamps the new size and calls `reset()`, because the population and agent list have to be recreated from scratch.

**Why does my saved brain disappear after a restart?**
This is expected in the current implementation — brain storage is **in-memory only**. Saved brains remain available for as long as the backend process keeps running. Persistent (database-backed) storage is on the roadmap.

---

## ✅ Quality Checks

Run these before publishing changes:

```bash
npm run typecheck
npm run lint
npm run server:build
npm run build
```

> There is no dedicated test script in the current `package.json` yet.

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

- Keep the backend simulation authoritative.
- Keep environments decoupled from evolution internals.
- Do not hard-code frontend telemetry that should come from `TrainingSession`.
- Keep environment state vectors numeric and documented.
- Add input/output labels when adding a network layout.
- Keep render-state fields aligned with environment collision geometry.
- Update this README when commands, routes, events, env vars, or deployment behavior changes.

Pull requests should describe:

- What changed
- Which environment or layer is affected
- How the AI/reward behavior changed, if applicable
- Which checks were run

---

## 🗺️ Roadmap

The current architecture is built to naturally support future environments and persistence upgrades. These are ideas, not implemented features yet:

- Flappy pipe spacing, pipe count, collision dimensions, and live rendering
- Dino Runner jump behavior, obstacle geometry, and one-obstacle spawning
- Snake movement cadence and grid movement
- Training session generation limits, history, speed control, and stop behavior
- Socket.IO start, pause, reset, configure, save, load, and replay actions
- Persistent brain storage with a database
- Export/import trained brains as files
- Self-driving car environment
- Racing line optimization
- Drone navigation
- Puzzle-solving environments
- Multi-agent competitive environments
- Training run comparison tools
- Public demo deployment
- Real project GitHub and Docker Hub links

---

## 📝 Notes

- Brain storage is in memory. Saved brains remain available while the backend process is running.
- The backend is authoritative for training. The frontend does not invent fitness or progress data.
- The app is structured so persistent database storage can be added later without changing the main UI flow.
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
