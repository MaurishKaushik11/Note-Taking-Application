import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",") || true,
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

export default app;
