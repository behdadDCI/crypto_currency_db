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

//View all News
export const getAllNews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.json(error);
  }
});

//create a News
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

//edit News
export const editNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData)
      const { title, description, image, newsId } = req.body;
      let imageUploadedUrl: string | undefined;
      if (req.file) {
        const localPath = `public/images/news/${req.file.filename}`;
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
        const news = await News.findByIdAndUpdate(newsId, updateData, {
          new: true,
        });
        res.json({ news: news, message: "news edited successfully"  });
      } catch (error) {
        res.json(error);
      } 
  }
);

//Delete News
export const deleteNews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    adminUser(userData)
      const { newsId } = req.body;
      try {
        const news = await News.findByIdAndDelete(newsId, {
          new: true,
        });
        res.json({ news: news, message: "news deleted successfully" });
      } catch (error) {
        res.json(error);
      }
  }
);
