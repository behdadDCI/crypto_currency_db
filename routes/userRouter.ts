import express from "express";
import { loginUser, registerUser, verifyAccount } from "../controllers/userController.ts";

const router = express.Router();

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.get("/api/verify_account/:token", verifyAccount);
export default router;
