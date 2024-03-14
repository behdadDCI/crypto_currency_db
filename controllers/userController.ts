import asyncHandler from "express-async-handler";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../interface/index";
import { Request, Response } from "express";
import { sendVerificationLinkToEmail } from "./email/sendEmail";
import crypto from "crypto";

interface CustomRequest extends Request {
  userId?: IUser;
}

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword, gender } =
      req.body;
    const existEmail = await Users.findOne({ email });
    if (existEmail)
      throw new Error("Oops! Looks like this email is already in our Database");
    if (password !== confirmPassword)
      throw new Error("Password and Confirm Password do not match.");

    try {
      const user = await Users.create({
        firstName,
        lastName,
        email,
        password,
        gender,
      });

      res.json({
        user: user,
        message: "You have successfully registered.",
      });
      console.log("Try");
    } catch (error) {
      console.log("Catch");
      res.json(error);
    }
  }
);

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email });
  if (userFound && (await userFound.isPasswordMatched(password))) {
    const {
      _id: userId,
      firstName,
      lastName,
      email,
      isAccountVerified,
      isAdmin,
      profile_photo: photo,
    } = userFound;
    const accessToken = jwt.sign(
      {
        userId,
        firstName,
        lastName,
        email,
        isAccountVerified,
        isAdmin,
        photo,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        userId,
        firstName,
        lastName,
        email,
        isAccountVerified,
        isAdmin,
        photo,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "30s",
      }
    );
    const user = await Users.findByIdAndUpdate(userId, {
      access_token: accessToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    const decode = jwtDecode<IUser>(accessToken);

    res.json({
      message: "Login successful",
      token: refreshToken,
      userInfo: decode,
      user: user,
    });
  } else {
    throw new Error("Invalid username or password");
  }
});

// Logout User
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;
  if (!token) throw new Error("no token");
  const user = await Users.findOne({ access_token: token });
  if (!user) throw new Error("No User");
  user.access_token = undefined;
  await user.save();
  res.clearCookie("accessToken");
  res.json({ message: "logout Successful" });
});

export const verifyUserEmail = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const loginUserId = req.userId;
    const user = await Users.findById(loginUserId);
    if (!user) throw new Error("");

    const verificationToken = await user.createAccountVerificationToken();
    await user.save();
    sendVerificationLinkToEmail(user.email, user.firstName, verificationToken);
    res.json({ message: "email gesendet", verificationToken });
  }
);

export const accountVerification = asyncHandler(async (req, res) => {
  const { token } = req.body;
  console.log("token", typeof token);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashedToken);
  const userFound = await Users.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("no user");
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json({ message: "alles gut" });
});

// Get All Users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

export const profilePhotoUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const localPath = `public/images/profile/${req.file.filename}`;
      const foundUser = await Users.findByIdAndUpdate(
        userId,
        {
          profile_photo: `https://crypto-currency-db.orosia.online/${localPath}`,
        },
        { new: true }
      );
      res.json(foundUser);
    } catch (error) {
      res.json(error);
    }
  }
);
