"use strict";
// import jwt from "jsonwebtoken";
// import User from "../model/user";
// import { Request,Response } from "express";
//  export const verifyingToken = async (req:Request, res:Response, next:()=>void) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("JWT")) {
//       return res
//         .status(401)
//         .send({ message: "Authorization header missing or invalid" });
//     }
//     //extracting the token from auth header
//     const token = req.headers.authorization.split(" ")[1];
//     //verify token using api secret key
//     const decode = jwt.verify(token, process.env.API_SECRET as );
//     //find user by decoded id
//     const user = await User.findById({ _id: decode.id });
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     } else {
//       // Attach the user object to the request
//       req.user = user;
//       next();//call the next function in the stack
//     }
//   } catch (error) {
//     // Handle different types of errors
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).send({ message: "Token has expired" });
//     }
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).send({ message: "Invalid token" });
//     }
//     // For other errors, set the user to undefined and proceed
//     console.error("Token verification error:", error);
//     return res.status(500).send({ message: "Internal server error" });
//   }
// };