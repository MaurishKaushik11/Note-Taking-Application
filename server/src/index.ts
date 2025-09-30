import { config } from "dotenv";
config();

import http from "http";
import app from "./app";
import { connectDB } from "./lib/db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
