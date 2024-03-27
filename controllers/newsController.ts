import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import News from "../models/newsModel";


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
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const news = await News.create(req.body);
    res.json({ news: news, message: "success" });
  } catch (error) {
    res.json(error);
  }
});

