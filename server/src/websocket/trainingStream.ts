import type { Server } from "socket.io";
import { TrainingSession } from "../training/TrainingSession";

type EnvironmentSlug = "flappy" | "dino" | "snake";

export function createTrainingStream(io: Server) {
  const sessions = new Map<string, TrainingSession>();
  const interval = setInterval(() => {
    sessions.forEach((session, id) => {
      session.tick();
      io.to(id).emit("training:update", session.snapshot());
    });
  }, 50);

  io.on("connection", (socket) => {
    const session = new TrainingSession("flappy");
    sessions.set(socket.id, session);
    socket.emit("training:update", session.snapshot());

    socket.on("training:configure", (payload: { environment?: EnvironmentSlug }) => {
      if (payload.environment) session.configure(payload.environment);
      socket.emit("training:update", session.snapshot());
    });
    socket.on("training:start", () => session.start());
    socket.on("training:pause", () => session.pause());
    socket.on("training:reset", () => session.reset());
    socket.on("training:replay", () => session.replayBest());
    socket.on("training:setSpeed", (speed: number) => session.setSpeed(speed));
    socket.on("training:setPopulation", (size: number) => session.setPopulation(size));
    socket.on("training:setMutation", (rate: number) => session.setMutation(rate));
    socket.on("training:setGenerationLimit", (limit: number) => session.setGenerationLimit(limit));
    socket.on("training:saveBrain", () => {
      const brain = session.saveBrain();
      socket.emit("training:notice", brain ? `Brain saved: ${brain.id}` : "No brain available yet");
    });
    socket.on("training:loadBrain", () => session.loadLatestBrain());

    socket.on("disconnect", () => sessions.delete(socket.id));
  });
}
