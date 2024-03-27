import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import { createPost, getAllPosts } from "../controllers/postController";
import {
  photoUpload,
  postPhotoResize,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

router.post(
  "/api/v1/posts/create",
  verifyToken,
 photoUpload.single("image"),
  postPhotoResize,
  createPost
);
router.get("/api/v1/posts", getAllPosts);

export default router;
