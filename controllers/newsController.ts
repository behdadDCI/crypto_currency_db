import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import News from "../models/newsModel";
import fs from "fs";
import { IPost } from "../interface";
import Users from "../models/userModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { adminUser } from "../utils/adminUser";
import { cloudinaryUploadImage } from "../utils/cloudinary";

interface CustomRequest extends Request {
  userId?: IPost;
}

//View all Posts
export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.json(error);
  }
});

//create a Post
export const createNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData)
    const { title, description } = req.body;
    const localPath = `public/images/news/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const news = await News.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ news: news, message: "success" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);