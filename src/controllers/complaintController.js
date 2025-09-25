import Complaint from "../models/Complaint.js";

// CREATE a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { headline, description, address, category, priority } = req.body;
    const userId = req.user._id; // from auth middleware

    // Prepare complaint data
    const complaintData = {
      headline,
      description,
      address,
      userId,
      category: category || "other",
      priority: priority || "medium"
    };

    // Handle photo if uploaded
    if (req.file) {
      complaintData.photo = {
        data: req.file.buffer, // binary data from memory storage
        contentType: req.file.mimetype // image/jpeg, image/png, etc.
      };
    }

    // Create and save new complaint
    const complaint = new Complaint(complaintData);
    await complaint.save();

    // Send response (without photo data to keep response size small)
    const responseComplaint = complaint.toObject();
    if (responseComplaint.photo) {
      responseComplaint.photo = {
        contentType: responseComplaint.photo.contentType,
        hasPhoto: true
      };
    }

    res.status(201).json({ 
      message: "Complaint submitted successfully",
      complaint: responseComplaint
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET all complaints for the authenticated user
export const getComplaints = async (req, res) => {
  try {
    let complaints;
    
    // If user is admin, show all complaints, otherwise show only user's complaints
    if (req.user.role === "admin") {
      complaints = await Complaint.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } else {
      complaints = await Complaint.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
    }

    // Remove photo data from response (too large), just indicate if photo exists
    const complaintsResponse = complaints.map(complaint => {
      const complaintObj = complaint.toObject();
      if (complaintObj.photo) {
        complaintObj.photo = {
          contentType: complaintObj.photo.contentType,
          hasPhoto: true
        };
      }
      return complaintObj;
    });

    res.status(200).json({ complaints: complaintsResponse });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET single complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name email");
    
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if user owns the complaint or is admin
    if (complaint.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this complaint" });
    }

    // Remove photo data from response, just indicate if photo exists
    const complaintResponse = complaint.toObject();
    if (complaintResponse.photo) {
      complaintResponse.photo = {
        contentType: complaintResponse.photo.contentType,
        hasPhoto: true
      };
    }

    res.status(200).json({ complaint: complaintResponse });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// GET complaint photo by ID
export const getComplaintPhoto = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (!complaint.photo || !complaint.photo.data) {
      return res.status(404).json({ message: "No photo found for this complaint" });
    }

    // Check if user owns the complaint or is admin
    if (complaint.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this photo" });
    }

    // Set appropriate headers and send photo
    res.set("Content-Type", complaint.photo.contentType);
    res.send(complaint.photo.data);
  } catch (error) {
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};