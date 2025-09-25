import express from "express";
import { createIssue, getIssues, updateIssueStatus } from "../controllers/issueController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST /api/issues -> create issue (with optional photo upload)
router.post("/", authMiddleware, upload.single("photo"), createIssue);

// GET /api/issues -> get all issues
router.get("/", getIssues);

// PUT /api/issues/:id/status -> update issue status (admin only)
router.put("/:id/status", authMiddleware, updateIssueStatus);

export default router;
