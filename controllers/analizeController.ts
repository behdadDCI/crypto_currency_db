import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
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

//edit Post
export const editAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    if (targetUser === userId || userData.isAdmin) {
      const { title, description, image, analyzeId } = req.body;
      let imageUploadedUrl: string | undefined;
      if (req.file) {
        const localPath = `public/images/analyze/${req.file.filename}`;
        const imageUploaded = await cloudinaryUploadImage(localPath);
        imageUploadedUrl = imageUploaded.url;
        fs.unlinkSync(localPath);
      }
      try {
        const updateData: any = { title, description };
        if (imageUploadedUrl) {
          updateData.image = imageUploadedUrl;
        } else if (image) {
          updateData.image = image;
        }
        const analyze = await Analysis.findByIdAndUpdate(analyzeId, updateData, {
          new: true,
        });
        res.json({ analyze: analyze, message: "Analyze edited successfully"  });
      } catch (error) {
        res.json(error);
      }
    }
      else{
        throw new Error("You are not authorized to edit this Analyze")
      }
    
  }
);

//Delete Post
export const deleteAnalyze = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    analysatorUser(userData)
    if (targetUser === userId || userData.isAdmin) {
      const { AnalyzeId } = req.body;
      try {
        const analyze = await Analysis.findByIdAndDelete(AnalyzeId, {
          new: true,
        });
        res.json({ analyze: analyze, message: "Analyze deleted successfully" });
      } catch (error) {
        res.json(error);
      }
    }else{
      throw new Error("You are not authorized to delete this Analyze")
    }
  }
);
