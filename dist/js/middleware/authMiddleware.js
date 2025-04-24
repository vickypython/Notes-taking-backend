"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = __importDefault(require("../model/user"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "authorization header is missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN);
        const user = yield user_1.default.findById(decode.id).exec();
        if (!user) {
            res.status(404).json({ message: "user not found" });
        }
        else {
            req.user = user;
            next();
        }
    }
    catch (error) {
        console.error("failed to autheticate:", error);
        res.status(403).json({ message: "forbidden" });
    }
});
exports.authMiddleware = authMiddleware;
