# Community Engagement Platform - Frontend

## Overview
This is a React-based frontend for the Community Engagement Platform that allows citizens to report community issues and government officials to manage and resolve them.

## Features
- **User Authentication**: Register and login functionality
- **Issue Reporting**: Citizens can report problems with title, description, and location
- **Public Dashboard**: View all reported issues with status indicators
- **Admin Panel**: Government officials can manage and update issue status
- **Responsive Design**: Works on desktop and mobile devices

## How to Run
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

## Backend Integration
The frontend connects to your existing backend APIs at `http://localhost:3000/api`. Make sure your backend server is running on port 3000.

## Current API Endpoints Used
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login  
- `POST /api/issues` - Create new issue (requires authentication)
- `GET /api/issues` - Get all issues

---

## ⚠️ REQUIRED API ADDITIONS

Your friend needs to implement the following additional API endpoints for full functionality:

### 1. Update Issue Status (CRITICAL for Admin Panel)
**Endpoint**: `PUT /api/issues/:id/status`
**Method**: PUT
**Authentication**: Required (Admin only)
**Body**:
```json
{
  "status": "open" | "in-progress" | "resolved"
}
```
**Response**:
```json
{
  "message": "Issue status updated successfully",
  "issue": { /* updated issue object */ }
}
```

**Controller Code Needed** (add to `issueController.js`):
```javascript
// Update issue status (admin only)
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Validate status
    const validStatuses = ['open', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("createdBy", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue status updated successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

**Route Addition** (add to `issueRoutes.js`):
```javascript
// Add this import at the top
import { createIssue, getIssues, updateIssueStatus } from "../controllers/issueController.js";

// Add this route
router.put("/:id/status", authMiddleware, updateIssueStatus);
```

### 2. Enhanced Issue Model (RECOMMENDED)
Add location field to the Issue schema in `models/Issue.js`:

```javascript
const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {  // ADD THIS FIELD
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
```

### 3. Update Create Issue Controller
Modify the `createIssue` function in `issueController.js` to handle location:

```javascript
export const createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body; // Add location

    if (!title || !description || !location) { // Add location validation
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    const issue = new Issue({
      title,
      description,
      location, // Add location
      createdBy: req.user.id,
    });

    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

---

## Frontend Components Structure

```
src/
├── components/
│   ├── Login.js              # User login form
│   ├── Register.js           # User registration form
│   ├── ReportIssue.js        # Issue reporting form
│   ├── IssuesDashboard.js    # Public issues view
│   └── AdminPanel.js         # Admin management panel
├── services/
│   └── api.js               # API integration functions
├── App.js                   # Main application component
├── App.css                  # All styling
└── index.js                 # React entry point
```

## User Roles
- **Regular User**: Can register, login, report issues, view all issues
- **Admin User**: All regular user features + can update issue status in admin panel

## Notes for Backend Developer
1. The admin panel is currently working with frontend-only updates until the status update API is implemented
2. Location field is currently added to the description until the Issue model is updated
3. JWT authentication is expected in the Authorization header as: `Bearer <token>`
4. CORS should be enabled for `http://localhost:3000` (frontend URL)

## Next Steps
Once the backend APIs are implemented:
1. Test the admin panel functionality
2. Verify location field is properly saved and displayed
3. Test end-to-end workflow: register → login → report issue → admin resolves → status updated
