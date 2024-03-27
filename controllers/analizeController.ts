import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import News from "../models/newsModel";
import fs from "fs";
import { IPost } from "../interface";
import Users from "../models/userModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { analysatorUser } from "../utils/analysatorUser";
import { cloudinaryUploadImage } from "../utils/cloudinary";
import Analysis from "../models/analyzeModel";

interface CustomRequest extends Request {
  userId?: IPost;
}

//View all Analysis
export const getAllAnalysis = asyncHandler(async (req: Request, res: Response) => {
  try {
    const analyze = await Analysis.find();
    res.json(analyze);
  } catch (error) {
    res.json(error);
  }
});

//create a Analyze
export const createAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    const { title, description } = req.body;
    const localPath = `public/images/analyze/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const analyze = await Analysis.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ analyze: analyze, message: "success" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);