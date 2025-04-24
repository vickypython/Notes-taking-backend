require("dotenv").config()
import express, {Express} from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
import NotesRoute from "./routes";
const app:Express= express();
app.use(express.json());
app.use(cors({
  origin:"https://note-taking-app-three-rosy.vercel.app",
  credentials:true
}));
app.use(cookieParser())
app.use(NotesRoute);
const HOST = '0.0.0.0';
const PORT = process.env.PORT || 10000;
const MONGO_URL: string =process.env.MONGODB_URL!
mongoose.connect(MONGO_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("connected", () => console.log("we are in cats"));
app.listen(10000,HOST, () => {
  console.log(`server running on ${HOST}:${PORT}`);
});
