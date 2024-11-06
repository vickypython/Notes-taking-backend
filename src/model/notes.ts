import { INotes } from "../types/type";
import { model, Schema } from "mongoose";

const notesSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
   },
  { timestamps: true }
);
export default model<INotes>("Notes", notesSchema);

