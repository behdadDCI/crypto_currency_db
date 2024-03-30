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
  targetUser?: IPost;
  postId?: IPost;
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
    console.log("create");
    const userId = req.userId;
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    const { title, description } = req.body;
    const localPath = `public/images/posts/${req.file.filename}`;
    const imageUploaded = await cloudinaryUploadImage(localPath);
    try {
      const post = await Posts.create({
        user: userId,
        title,
        image: imageUploaded.url,
        description,
      });
      res.json({ post: post, message: "Post created successfully" });
      fs.unlinkSync(localPath);
    } catch (error) {
      res.json(error);
    }
  }
);

//edit Post
export const editPost = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const targetUser = req.body.targetUser;
    const userData = await Users.findById(userId);
    console.log(targetUser);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
      const { title, description, image, postId } = req.body;
      let imageUploadedUrl: string | undefined;
      if (req.file) {
        const localPath = `public/images/posts/${req.file.filename}`;
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
        const post = await Posts.findByIdAndUpdate(postId, updateData, {
          new: true,
        });
        res.json({ post: post, message: "Post edited successfully" });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to edit this post");
    }
  }
);

//Delete Post
export const deletePost = asyncHandler(

  async (req: CustomRequest, res: Response) => {
    console.log("first")
    const userId = req.userId;
    const { postId, targetUser } = req.body;
console.log(req.body)
    console.log("userId: ", userId);
    console.log("targetUser: ", targetUser);
    const userData = await Users.findById(userId);
    blockUser(userData);
    verifyUser(userData);
    if (targetUser === userId || userData.isAdmin) {
      console.log("postId: ", postId);
      try {
        const post = await Posts.findByIdAndDelete(postId, {
          new: true,
        });
        res.json({_id:postId, post: post, message: "Post deleted successfully" });
      } catch (error) {
        res.json(error);
      }
    } else {
      throw new Error("You are not authorized to delete this post");
    }
  }
);
