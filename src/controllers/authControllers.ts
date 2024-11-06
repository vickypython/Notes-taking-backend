import { IUser } from "../types/type";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user";
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
const saltrounds = 8;
const signUp = async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body 
  
  try {
    //Check if required fields are present
    if (!fullName || !email || !password || !role) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields." });
    }

    //Create a new user instance of the schema
    const user: IUser = new User({
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
    const userId = {
      id: user._id,
    };
    const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN as string, {
      expiresIn: 86400, // 24 hours
    });
    const refreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN as string, {
      expiresIn: "7d",
    });
    //5.put the refresh token in the database
    user.refreshToken = refreshToken;

    res.cookieParser("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });

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
  } catch (error:any) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};
const logOut = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
};
const refreshToken = async (req:Request, res:Response) => {
  const token = req.cookies.refreshToken;
  const { email } = req.body;
  if (!token) return res.send({ accessToken: "" });

  try {
    //1.verify the refreshtoken
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN as string);

    //2.token exist check for user in the database
    const user = await User.findOne({ email: email }).exec();
    if (!user) return res.send({ accessToken: "" });
    //3.user exists check for refreshtoken
    if (user.refreshToken !== token) return res.send({ accessToken: "" });
    const userId = {
      id: user._id.toString(),
    };
    //check if the id are the same
    if (userId !== payload.id) return res.send({ accessToken: "" });

    //4.token exist create new accesstoken
    const accessToken = jwt.sign(userId, process.env.ACCESS_TOKEN as string, {
      expiresIn: 86400, // 24 hours
    });
    const newRefreshToken = jwt.sign(userId, process.env.REFRESH_TOKEN as string, {
      expiresIn: "7d",
    });
    //5.put the refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });
    res.send({ accessToken: accessToken });
  } catch (error) {
    console.error("Error refreshing the token:", error);
    res.status(403).json({ message: "invalid accessToken" });
  }
};
export { signIn, signUp, logOut, refreshToken };
