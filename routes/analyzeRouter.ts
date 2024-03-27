import express from "express";
import { verifyToken } from "../middlewares/token/verifyToken";
import { createAnalyze, getAllAnalysis } from "../controllers/analizeController";


const router = express.Router();

router.post("/api/v1/analyze/create", verifyToken, createAnalyze);
router.get("/api/v1/analysis", getAllAnalysis);


export default router;
