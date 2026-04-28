import express from "express";
import { getProgress, submitProgress } from "../controllers/progressController.js";

const router = express.Router();

router.get("/:email", getProgress);
router.post("/submit", submitProgress);

export default router;
