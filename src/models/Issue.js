import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    // User report text
    report: {
        type: String,
        required: [true, 'Report description is required'],
        trim: true,
        minlength: [10, 'Report must be at least 10 characters long'],
        maxlength: [2000, 'Report cannot exceed 2000 characters']
    },
    
    // Optional photo upload
    photo: {
        filename: {
            type: String,
            default: null
        },
        originalName: {
            type: String,
            default: null
        },
        path: {
            type: String,
            default: null
        },
        size: {
            type: Number,
            default: null
        },
        mimetype: {
            type: String,
            default: null
        }
    },
    
    // Location of the issue
    location: {
        address: {
            type: String,
            required: [true, 'Location address is required'],
            trim: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: false,
                min: [-90, 'Invalid latitude'],
                max: [90, 'Invalid latitude']
            },
            longitude: {
                type: Number,
                required: false,
                min: [-180, 'Invalid longitude'],
                max: [180, 'Invalid longitude']
            }
        }
    },
    
    // Nearby municipality
    nearbyMunicipality: {
        type: String,
        required: [true, 'Nearby municipality is required'],
        trim: true
    },
    
    // Additional fields for management
    status: {
        type: String,
        enum: ['reported', 'assigned', 'in-progress', 'resolved', 'closed'],
        default: 'reported'
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    
    category: {
        type: String,
        enum: [
            'infrastructure', 
            'sanitation', 
            'transportation', 
            'utilities', 
            'environment', 
            'safety', 
            'other'
        ],
        default: 'other'
    },
    
    // User who reported 
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    
    // Admin assignment
    assignedTo: {
        type: String,
        default: null
    },
    
    // Resolution details
    resolution: {
        description: {
            type: String,
            default: null
        },
        resolvedAt: {
            type: Date,
            default: null
        },
        resolvedBy: {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for geospatial queries
issueSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
issueSchema.index({ 
    report: 'text', 
    'location.address': 'text', 
    nearbyMunicipality: 'text' 
});

// Virtual for photo URL
issueSchema.virtual('photoUrl').get(function() {
    if (this.photo && this.photo.path) {
        return `/uploads/${this.photo.filename}`;
    }
    return null;
});

// Method to update status
issueSchema.methods.updateStatus = function(newStatus, userId = null) {
    this.status = newStatus;
    if (newStatus === 'resolved' && !this.resolution.resolvedAt) {
        this.resolution.resolvedAt = new Date();
        this.resolution.resolvedBy = userId;
    }
    return this.save();
};

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
