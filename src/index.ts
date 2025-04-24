require("dotenv").config()
import express, {Express} from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
import NotesRoute from "./routes";
const app:Express= express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use(NotesRoute);
const MONGO_URL: string =process.env.MONGODB_URL!
mongoose.connect(MONGO_URL, {
 ssl: true,
  tlsInsecure: false,
  serverApi: '1', // optional, forces Stable API
  tlsAllowInvalidCertificates: false
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("connected", () => console.log("we are in cats"));
app.listen(10000, () => {
  console.log(`server running on localhost:${process.env.PORT}`);
});
