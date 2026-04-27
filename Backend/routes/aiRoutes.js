import express from "express";
import { askQuestion, evaluateAnswer } from "../controllers/aiController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("AI route is working");
});

// Socratic Gatekeeper endpoints
router.post("/ask-question", askQuestion);
router.post("/evaluate", evaluateAnswer);

export default router;
