import http from "node:http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { config } from "./config/env";
import { environmentsRouter } from "./routes/environments";
import { brainsRouter } from "./routes/brains";
import { createTrainingStream } from "./websocket/trainingStream";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [config.clientOrigin, "http://127.0.0.1:3000", "http://localhost:3000"]
  }
});

app.use(cors({ origin: [config.clientOrigin, "http://127.0.0.1:3000", "http://localhost:3000"] }));
app.use(express.json());
app.get("/health", (_request, response) => response.json({ ok: true, service: "neuroplay-api" }));
app.use("/api/environments", environmentsRouter);
app.use("/api/brains", brainsRouter);

createTrainingStream(io);

server.listen(config.port, () => {
  console.log(`NeuroPlay API listening on http://localhost:${config.port}`);
});
