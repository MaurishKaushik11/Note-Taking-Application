import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Note } from "../models/Note";

const router = Router();

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.user!.sub;
  const notes = await Note.find({ userId }).sort({ createdAt: -1 });
  res.json({ notes });
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const userId = req.user!.sub;
  const { title, content = "" } = parsed.data;
  const note = await Note.create({ userId, title, content });
  res.status(201).json({ note });
});

const idSchema = z.object({ id: z.string().min(1) });

// Update a note (title/content)
const updateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  const params = idSchema.safeParse(req.params);
  if (!params.success) return res.status(400).json({ error: params.error.flatten() });
  const body = updateSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: body.error.flatten() });
  const userId = req.user!.sub;
  const { id } = params.data;
  const update: Record<string, unknown> = {};
  if (typeof body.data.title !== "undefined") update.title = body.data.title;
  if (typeof body.data.content !== "undefined") update.content = body.data.content;
  if (Object.keys(update).length === 0) return res.status(400).json({ error: "no_fields_to_update" });
  const note = await Note.findOneAndUpdate({ _id: id, userId }, { $set: update }, { new: true });
  if (!note) return res.status(404).json({ error: "not_found" });
  res.json({ note });
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  const params = idSchema.safeParse(req.params);
  if (!params.success) return res.status(400).json({ error: params.error.flatten() });
  const userId = req.user!.sub;
  const { id } = params.data;
  const result = await Note.findOneAndDelete({ _id: id, userId });
  if (!result) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true });
});

export default router;
