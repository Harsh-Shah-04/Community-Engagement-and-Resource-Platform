import Issue from "../models/Issue.js";

// Create new issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, location, category, priority } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    const issue = new Issue({
      title,
      description,
      location,
      category: category || 'other',
      priority: priority || 'medium',
      createdBy: req.user.id, // from authMiddleware
    });

    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate("createdBy", "name email");
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update issue status (admin only)
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    const validStatuses = ["open", "in-progress", "resolved"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: open, in-progress, resolved" 
      });
    }

    // Check if user is admin (this check is done in middleware but adding here for safety)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    // Find and update the issue
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    // Return updated issue with user details
    await issue.populate("createdBy", "name email");
    
    res.json({ 
      message: "Issue status updated successfully", 
      issue 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
