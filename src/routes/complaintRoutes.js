import express from "express";
import { createComplaint, getComplaints, getComplaintById, getComplaintPhoto } from "../controllers/complaintController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All complaint routes require authentication
router.use(protect);

// Route: POST /api/complaints - Create new complaint with photo upload
router.post("/", upload.single("photo"), createComplaint);

// Route: GET /api/complaints - Get all complaints (user's own or all if admin)
router.get("/", getComplaints);

// Route: GET /api/complaints/:id - Get single complaint by ID
router.get("/:id", getComplaintById);

// Route: GET /api/complaints/:id/photo - Get complaint photo
router.get("/:id/photo", getComplaintPhoto);

export default router;