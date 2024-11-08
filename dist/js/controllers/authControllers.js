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
exports.logOut = exports.signUp = exports.signIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../model/user"));
const saltrounds = 8;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, role } = req.body;
    try {
        //Check if required fields are present
        if (!fullName || !email || !password || !role) {
            return res
                .status(400)
                .send({ message: "Please provide all required fields." });
        }
        //Create a new user instance of the schema
        const user = new user_1.default({
            fullName: fullName,
            email: email,
            role: role,
            //hash the user password make it unreadable
            password: bcrypt_1.default.hashSync(password, saltrounds),
        });
        // Save the user to the database
        yield user.save();
        res.status(201).send({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        //1.find the user in the database
        const user = yield user_1.default.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).send({
                message: "User Not found.",
            });
        }
        //2.check the password of the user request if  its the same with the one in the database
        const passwordIsValid = bcrypt_1.default.compareSync(password, user.password);
        //3.if password not valid send the response
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }
        //4.if it is valid asign the user an access token
        const userId = {
            id: user._id,
        };
        const accessToken = jsonwebtoken_1.default.sign(userId, process.env.ACCESS_TOKEN, {
            expiresIn: 86400, // 24 hours
        });
        const refreshToken = jsonwebtoken_1.default.sign(userId, process.env.REFRESH_TOKEN, {
            expiresIn: "7d",
        });
        //5.put the refresh token in the database
        // user.refreshToken = refreshToken;
        // res.cookieParser("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   path: "/refreshToken",
        // });
        //6.send the user detail with access token a
        res.status(200).send({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
            message: "login successful", //string
            accessToken: accessToken,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            message: error.message,
        });
    }
});
exports.signIn = signIn;
const logOut = (req, res) => {
    res.clearCookie("refreshToken");
};
exports.logOut = logOut;
//refreshToken
