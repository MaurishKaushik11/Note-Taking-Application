import { Router } from "express";
import { z } from "zod";
import { createOtp, verifyOtp } from "../services/otp";
import { sendOtpEmail } from "../services/email";
import { signToken } from "../utils/jwt";
import { User } from "../models/User";
import { OAuth2Client } from "google-auth-library";

const router = Router();

const emailSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "name_required"),
});

router.post("/request-otp", async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email } = parsed.data;
  try {
    const code = await createOtp(email);
    await sendOtpEmail(email, code);
    return res.json({ ok: true });
  } catch (err) {
    console.error("/request-otp error", err);
    return res.status(500).json({ error: "failed_to_send_otp" });
  }
});

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
  name: z.string().min(1, "name_required"),
});

router.post("/verify-otp", async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, code, name } = parsed.data;
  try {
    const result = await verifyOtp(email, code);
    if (!result.ok) return res.status(400).json({ error: result.reason });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $setOnInsert: { email: email.toLowerCase() }, $set: { name, provider: "email" } },
      { new: true, upsert: true }
    );

    const token = signToken({ sub: String(user._id), email: user.email, name: user.name || undefined });
    return res.json({ token, user });
  } catch (err) {
    console.error("/verify-otp error", err);
    return res.status(500).json({ error: "verification_failed" });
  }
});

const googleSchema = z.object({ idToken: z.string().min(10) });

router.post("/google", async (req, res) => {
  const parsed = googleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { idToken } = parsed.data;
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: "google_not_configured" });

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ error: "invalid_google_token" });

    const email = payload.email.toLowerCase();
    const name = payload.name || "";
    const picture = payload.picture || "";

    const user = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { email }, $set: { name, avatarUrl: picture, provider: "google" } },
      { new: true, upsert: true }
    );

    const token = signToken({ sub: String(user._id), email: user.email, name: user.name || undefined });
    return res.json({ token, user });
  } catch (err) {
    console.error("/google error", err);
    return res.status(500).json({ error: "google_auth_failed" });
  }
});

export default router;
