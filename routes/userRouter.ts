import express from "express";
import {
  accountVerification,
  getAllUsers,
  loginUser,
  logoutUser,
  profilePhotoUser,
  registerUser,
  verifyUserEmail,
  accessTokenExpired,
  editProfileInfo,
  changePassword,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/token/verifyToken";
import { refreshToken } from "../controllers/refreshToken";
import {
  photoUpload,
  profilePhotoResize,
} from "../middlewares/upload/photoUpload";

const router = express.Router();

router.get("/api/v1/token", refreshToken);
router.get("/api/v1/check-token", accessTokenExpired);
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

router.put("/api/v1/users/edit_profile_info", verifyToken, editProfileInfo);

router.put("/api/v1/users/change_password", verifyToken, changePassword);

export default router;
