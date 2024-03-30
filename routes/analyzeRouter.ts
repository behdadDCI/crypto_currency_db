import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import {
  createAnalyze,
  deleteAnalyze,
  editAnalyze,
  getAllAnalysis,
} from "../controllers/analizeController";
import {
  analyzePhotoResize,
  photoUpload,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

router.post(
  "/api/v1/analyze/create",
  verifyToken,
  photoUpload.single("image"),
  analyzePhotoResize,
  createAnalyze
);

router.put(
  "/api/v1/analyze/edit",
  verifyToken,
  photoUpload.single("image"),
  analyzePhotoResize,
  editAnalyze
);

router.delete("/api/v1/analyze/delete", verifyToken, deleteAnalyze);

router.get("/api/v1/analysis", getAllAnalysis);

export default router;
