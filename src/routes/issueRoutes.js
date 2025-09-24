import express from "express";
import { createIssue, getIssues, updateIssueStatus } from "../controllers/issueController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/issues -> create issue
router.post("/", protect, createIssue);

// GET /api/issues -> get all issues
router.get("/", getIssues);

// PUT /api/issues/:id/status -> update issue status (admin only)
router.put("/:id/status", protect, admin, updateIssueStatus);

export default router;
