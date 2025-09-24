import express from "express";
import { createIssue, getIssues } from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/issues -> create issue
router.post("/", authMiddleware, createIssue);

// GET /api/issues -> get all issues
router.get("/", getIssues);

export default router;
