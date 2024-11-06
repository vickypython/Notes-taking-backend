"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
const MONGO_URL = "mongodb+srv://vickymlucky:vicky@cluster0.xaqfsym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default.connect(MONGO_URL);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.log(error));
db.once("connected", () => console.log("we are in cats"));
app.listen(5000, () => {
    console.log("server running on localhost:5000");
});
