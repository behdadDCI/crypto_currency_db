import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Analysis from "../models/analyzeModel";


//View all Analysis
export const getAllAnalysis = asyncHandler(async (req: Request, res: Response) => {
  try {
    const analyze = await Analysis.find();
    res.json(analyze);
  } catch (error) {
    res.json(error);
  }
});

//create a analyze
export const createAnalyze = asyncHandler(async (req: Request, res: Response) => {
  try {
    const analyze = await Analysis.create(req.body);
    res.json({ analyze: analyze, message: "success" });
  } catch (error) {
    res.json(error);
  }
});

