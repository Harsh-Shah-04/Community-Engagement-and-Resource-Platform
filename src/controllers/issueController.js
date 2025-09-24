import Issue from "../models/Issue.js";

// Create new issue
export const createIssue = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const issue = new Issue({
      title,
      description,
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
