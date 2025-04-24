// import { IUser} from "../types/type";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
interface jwtPayload {
  id: string;
}
const saltrounds = 8;
const signUp = async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body;

  try {
    //Check if required fields are present
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    //Create a new user instance of the schema
    const user= new User({
      fullName: fullName,
      email: email,
      role: role,
      //hash the user password make it unreadable
      password: bcrypt.hashSync(password, saltrounds),
    });

    // Save the user to the database
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    //1.find the user in the database

    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).send({
        message: "User Not found.",
      });
    }
    //2.check the password of the user request if  its the same with the one in the database
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    //3.if password not valid send the response
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //4.if it is valid asign the user an access token
    const userid = {
      id: user._id,
    };
    const accessToken = jwt.sign(userid, process.env.ACCESS_TOKEN as string, {
      expiresIn:"24h", // 24 hours
    });
    const refreshToken = jwt.sign(userid, process.env.REFRESH_TOKEN as string, {
      expiresIn: "7d",
    });
    //5.put the refresh token in the database
    user.refreshToken = refreshToken;
    // Set the refresh token as a secure, HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true, // use true if using HTTPS
      path: "/refreshToken",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    await user.save();
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
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};
const logOut = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    // Find the user by refresh token and clear it in the database
    const user = await User.findOne({ refreshToken: token }).exec();
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.clearCookie("refreshToken", { path: "/refreshToken" });
  }

  res.status(200).json({ message: "log out successfully" });
};
const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  console.log(token);
  const { email } = req.body;
  if (!token) {
    res.send({
      message:"No refreshtoken found",
      accessToken: "" });
    return;
  }

  try {
    //1.verify the refreshtoken
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN as string
    ) as jwtPayload;

    //2.token exist check for user in the database
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      res.send({ 
        message:"No user found in the database",
        accessToken: "" });
      return;
    }
    //3.user exists check for refreshtoken
    if (user.refreshToken !== token) {
      res.send({ 
        message:"invalid refreshtoken",
        accessToken: "" });
      return;
    }
    const userId = {
      id: user._id.toString(),
    };
    //check if the id are the same
    if (user._id.toString() !== payload.id) {
      res.send({
        message:"user id is not the same",
         accessToken: "" });
      return;
    }

    //4.token exist create new accesstoken
    const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN as string, {
      expiresIn: "24h" // 24 hours
    });
    const newRefreshToken = jwt.sign(
      userId,
      process.env.REFRESH_TOKEN as string,
      {
        expiresIn: "7d",
      }
    );
    //5.put the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();
    // Update the cookie with the new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      // secure: true, // use true if using HTTPS
      path: "/refreshToken",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.send({ accessToken: accessToken });
  } catch (error: any) {
    console.error("Error refreshing the token:", error);
    res.status(403).json({ message: "invalid accessToken" });
  }
};
export { signIn, signUp, logOut, refreshToken };
