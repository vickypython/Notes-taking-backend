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
exports.verifyingToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../model/user"));
const verifyingToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("JWT")) {
            return res
                .status(401)
                .send({ message: "Authorization header missing or invalid" });
        }
        //extracting the token from auth header
        const token = (authHeader || "").split(" ")[1];
        //verify token using api secret key
        const secretKey = process.env.API_SECRET;
        const decode = jsonwebtoken_1.default.verify(token, secretKey);
        //find user by decoded id
        const user = yield user_1.default.findById({ _id: decode.id });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        else {
            // Attach the user object to the request
            req.user = user;
            next(); //call the next function in the stack
        }
    }
    catch (error) {
        // Handle different types of errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ message: "Token has expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ message: "Invalid token" });
        }
        // For other errors, set the user to undefined and proceed
        console.error("Token verification error:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
});
exports.verifyingToken = verifyingToken;
