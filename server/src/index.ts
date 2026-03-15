import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import { setupWSConnection } from "y-websocket/bin/utils";

const PORT = 3001;

const app = express();
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
});

server.listen(PORT, () => {
  console.log(`Score Canvas collab server running on http://localhost:${PORT}`);
});
