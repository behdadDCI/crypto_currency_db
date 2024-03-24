import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Posts from "../models/postModel";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  try {
    const post = await Posts.create(req.body);
    res.json({ post: post, message: "success" });
  } catch (error) {
    res.json(error);
  }
});
