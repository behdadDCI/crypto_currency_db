import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Posts from "../models/postModel";

//View all Posts
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Posts.find();
    res.json({ post: post, message: "success" });
  } catch (error) {
    res.json(error);
  }
});

//create a Post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Posts.create(req.body);
    res.json({ post: post, message: "success" });
  } catch (error) {
    res.json(error);
  }
});

// get All News
export const getNewsPosts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newsPosts = await Posts.find({
        category: "6602a16d2b649a27866bde04",
      });
      res.json({ post: newsPosts, message: "success" });
    } catch (error) {
      res.json(error);
    }
  }
);

// get All Analyz
export const getAnalyzePosts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const analyzePosts = await Posts.find({
        category: "6602a1632b649a27866bde02",
      });
      res.json({ post: analyzePosts, message: "success" });
    } catch (error) {
      res.json(error);
    }
  }
);

// get All usersProfilePosts
export const getusersPosts = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const usersPost = await Posts.find({
        category: "6602a13c2b649a27866bddff",
      });
      res.json({ post: usersPost, message: "success" });
    } catch (error) {
      res.json(error);
    }
  }
);
