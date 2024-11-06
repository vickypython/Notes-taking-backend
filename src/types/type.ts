import { Document } from "mongoose";
export interface INotes extends Document {
  title: string;
  content: string;
}
export interface IUser extends Document {
  fullName: string;
  email: string;
  role: "normal" | "admin";
  password: string;
  created: Date;
}
