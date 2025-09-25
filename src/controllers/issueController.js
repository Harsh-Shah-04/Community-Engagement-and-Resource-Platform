import Issue from "../models/Issue.js";

// Create new issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, location, category, priority } = req.body;

    // Validate required fields - adapt to your current schema
    if (!description && !req.body.report) {
      return res.status(400).json({ message: "Issue description is required" });
    }

    // Handle photo upload
    let photoData = {};
    if (req.file) {
      photoData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      };
    }

    // Create issue with your schema structure
    const issueData = {
      // Use 'report' field as per your schema, but also support 'description' from frontend
      report: req.body.report || description || title,
      
      // Handle location - adapt to your schema
      location: {
        address: location || req.body.address || "Location not specified"
      },
      
      // Default municipality if not provided
      nearbyMunicipality: req.body.nearbyMunicipality || req.body.municipality || "Not specified",
      
      // Optional fields
      category: category || 'other',
      priority: priority || 'medium',
      
      // Photo if uploaded
      ...(req.file && { photo: photoData }),
      
      // User who reported
      reportedBy: req.user.id
    };

    const issue = new Issue(issueData);
    await issue.save();
    
    res.status(201).json({ 
      message: "Issue created successfully", 
      issue: issue 
    });
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 }); // Most recent first
    
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Validate status - using your schema values
    const validStatuses = ['reported', 'assigned', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { 
        status,
        // If resolving, add resolution timestamp
        ...(status === 'resolved' && {
          'resolution.resolvedAt': new Date(),
          'resolution.resolvedBy': req.user.name || req.user.id
        })
      },
      { new: true }
    ).populate("reportedBy", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue status updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
