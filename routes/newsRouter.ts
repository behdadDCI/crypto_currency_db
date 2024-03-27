import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import { createNews, getAllNews } from "../controllers/newsController";

const router = express.Router();

router.post("/api/v1/news/create", verifyToken, createNews);
router.get("/api/v1/news", getAllNews);

export default router;
