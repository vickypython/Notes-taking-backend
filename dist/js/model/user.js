"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "fullname not provided "],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "email not provided"],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [true, "Please specify user role"],
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});
exports.default = (0, mongoose_1.model)("User", userSchema);
