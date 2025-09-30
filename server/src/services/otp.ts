import { addMinutes, isBefore } from "date-fns";
import { Otp } from "../models/Otp";

export function generateOtpCode(len = 6) {
  let code = "";
  for (let i = 0; i < len; i++) code += Math.floor(Math.random() * 10).toString();
  return code;
}

export async function createOtp(email: string) {
  const code = generateOtpCode(6);
  const expiresAt = addMinutes(new Date(), 10);
  await Otp.create({ email: email.toLowerCase(), code, expiresAt });
  return code;
}

export async function verifyOtp(email: string, code: string) {
  const entry = await Otp.findOne({ email: email.toLowerCase(), code }).sort({ createdAt: -1 });
  if (!entry) return { ok: false, reason: "invalid_code" as const };
  if (entry.consumed) return { ok: false, reason: "already_used" as const };
  if (isBefore(entry.expiresAt, new Date())) return { ok: false, reason: "expired" as const };
  entry.consumed = true;
  await entry.save();
  return { ok: true } as const;
}
