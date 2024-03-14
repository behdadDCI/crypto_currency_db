import express from "express";
import {
  accountVerification,
  getAllUsers,
  loginUser,
  logoutUser,
  profilePhotoUser,
  registerUser,
  verifyUserEmail,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/token/verifyToken";
import { refreshToken } from "../controllers/refreshToken";
import { photoUpload, profilePhotoResize } from "../middlewares/upload/photoUpload";

const router = express.Router();

router.get("/api/v1/token", refreshToken);

router.post("/api/v1/register", registerUser);
router.post("/api/v1/login", loginUser);
router.delete("/api/v1/logout", logoutUser);
router.post(
  "/api/v1/generate-verify-email-token",
  verifyToken,
  verifyUserEmail
);
router.put("/api/v1/verify-account", accountVerification);

router.get("/api/v1/users", getAllUsers);

router.put(
  "/api/v1/users/profile_photo_upload",
  verifyToken,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUser
);

export default router;
