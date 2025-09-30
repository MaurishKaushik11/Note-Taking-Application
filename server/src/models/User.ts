import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  avatarUrl: { type: String },
  provider: { type: String, enum: ["email", "google"], default: "email" },
}, { timestamps: true });

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: any };

export const User = model("User", userSchema);
