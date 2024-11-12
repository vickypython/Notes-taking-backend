import { Document, ObjectId } from "mongoose";
export interface INotes extends Document {
  title: string;
  content: string;
  userId:ObjectId
}
export interface IUser extends Document {
  _id: ObjectId;
  fullName: string;
  email: string;
  role: "normal" | "admin";
  password: string;
  created: Date;
  refreshToken?: string;
}
