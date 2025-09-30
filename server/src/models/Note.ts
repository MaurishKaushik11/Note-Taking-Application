import { Schema, model, Types, InferSchemaType } from "mongoose";

const noteSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  content: { type: String, default: "" },
}, { timestamps: true });

export type NoteDoc = InferSchemaType<typeof noteSchema> & { _id: any };

export const Note = model("Note", noteSchema);
