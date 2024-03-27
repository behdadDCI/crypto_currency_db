import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import { createNews, getAllNews } from "../controllers/newsController";
import { newsPhotoResize, photoUpload } from "../middlewares/upload/photoUpload";

const router = express.Router();

router.post("/api/v1/news/create", verifyToken, photoUpload.single("image"),
newsPhotoResize, createNews);
router.get("/api/v1/news", getAllNews);

export default router;
