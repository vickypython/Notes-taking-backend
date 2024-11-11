import { INotes } from "../types/type";
import mongoose, { model, Schema } from "mongoose";

const notesSchema: Schema = new Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
    },
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

