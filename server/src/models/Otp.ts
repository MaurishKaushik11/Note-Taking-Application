import { Schema, model, InferSchemaType } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  consumed: { type: Boolean, default: false },
}, { timestamps: true });

export type OtpDoc = InferSchemaType<typeof otpSchema> & { _id: any };

export const Otp = model("Otp", otpSchema);
