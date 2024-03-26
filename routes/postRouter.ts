import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import {
  createPost,
  getAllPosts,
  getAnalyzePosts,
  getNewsPosts,
  getusersPosts,
} from "../controllers/postController";

const router = express.Router();

router.post("/api/v1/posts/create", verifyToken, createPost);
router.get("/api/v1/posts", verifyToken, getAllPosts);
router.get("/api/v1/posts/user-post", verifyToken, getusersPosts);
router.get("/api/v1/posts/news", verifyToken, getNewsPosts);
router.get("/api/v1/posts/analyze", verifyToken, getAnalyzePosts);

export default router;
