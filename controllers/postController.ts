import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Posts from "../models/postModel";
import { blockUser } from "../utils/blockUser";
import { verifyUser } from "../utils/verifyUser";
import { IPost } from "../interface";
import { cloudinaryUploadImage } from "../utils/cloudinary";
import fs from "fs";
import Users from "../models/userModel";

interface CustomRequest extends Request {
  userId?: IPost;
}

//View all Posts
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Posts.find();
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//create a Post
export const createPost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    const { title, description } = req.body;
    console.log(req.body);
    const localPath = `public/images/posts/${req.file.filename}`;
    console.log("localPath: ", localPath);
    const imageUploaded = await cloudinaryUploadImage(localPath);
    console.log("imageUploaded: ", imageUploaded);
    try {
      const post = await Posts.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ post: post, message: "success" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);
