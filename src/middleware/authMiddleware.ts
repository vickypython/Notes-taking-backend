import { NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "../model/user";
import { ObjectId } from "mongodb";
export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decode = verify(
      token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    const user = await User.findById(decode.id).exec();
    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    console.error("failed to autheticate:", error);
    res.status(403).json({ message: "forbidden" });
  }
};
