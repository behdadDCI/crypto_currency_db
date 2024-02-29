import express from "express";
import { getAllUsers, loginUser, registerUser, verifyAccount } from "../controllers/userController";

const router = express.Router();

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);
router.get("/api/verify_account/:token", verifyAccount);
router.get("/api/users", getAllUsers);
export default router;
