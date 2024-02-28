import asyncHandler from "express-async-handler";
import randomBytes from "randombytes";
import Users from "../models/userModel.ts";
import jwt from "jsonwebtoken";
import { sendVerificationLinkToEmail } from "./email/sendEmail.ts";
import { jwtDecode } from "jwt-decode";
import { IUser } from "../interface/index.ts";
import { Request, Response } from "express";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword, gender } =
      req.body;
    const existEmail = await Users.findOne({ email });
    if (existEmail)
      throw new Error("Oops! Looks like this email is already in our system");
    if (password !== confirmPassword)
      throw new Error("Password and Confirm Password do not match.");

    await Users.create({ firstName, lastName, email, password, gender });
    const randomVerifyAccountToken = randomBytes(16).toString("hex");
    const verifyToken = jwt.sign(
      {
        email,
        randomVerifyAccountToken,
      },
      process.env.VERIFY_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("verifyAccount", verifyToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false,
    });

    await sendVerificationLinkToEmail(
      email,
      firstName,
      randomVerifyAccountToken
    );
    res.status(201).json({
      message: "You have successfully registered.",
      token: randomVerifyAccountToken,
    });
  }
);

export const verifyAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const verifyAccount = req.cookies.verifyAccount;
    if (!verifyAccount) throw new Error("Invalid link.");
    const decoded = jwtDecode<IUser>(verifyAccount);
    const email = decoded.email;
    const randomVerifyAccountToken = decoded.randomVerifyAccountToken;
    console.log("randomVerifyAccountToken", randomVerifyAccountToken);
    if (token !== randomVerifyAccountToken) {
      throw new Error("token ist üngultig");
    }
    const user = await Users.findOne({ email });
    if (!user) throw new Error("You must register first.");
    user.isAccountVerified = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Account verified successfully." });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userFound = await Users.findOne({ email });
  if (userFound && (await userFound.isPasswordMatched(password))) {
    if (!userFound.isAccountVerified) {
      const randomVerifyAccountToken = randomBytes(16).toString("hex");
      const verifyToken = jwt.sign(
        {
          email,
          randomVerifyAccountToken,
        },
        process.env.VERIFY_TOKEN_SECRET as string,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("verifyAccount", verifyToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: false,
      });

      await sendVerificationLinkToEmail(
        email,
        userFound.firstName,
        randomVerifyAccountToken
      );
      throw new Error(
        "A verification link has been sent to your email for account activation."
      );
    }
    const {
      _id: userId,
      firstName,
      lastName,
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
    await Users.findByIdAndUpdate(userId, { access_token: accessToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    });

    const decode = jwtDecode<IUser>(accessToken);
    const userInfo = {
      firstName: decode.firstName,
      lastName: decode.lastName,
      photo: decode.photo,
      isAccountVerified:decode.isAccountVerified
    };

    res.json({
      message: "Login successful",
      token: refreshToken,
      userInfo: userInfo,
    });
  }else{
    throw new Error("Invalid username or password")
  }
});
