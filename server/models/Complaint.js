const mongoose = require("mongoose");

/* ---------------- CATEGORY NORMALIZATION ---------------- */

const CATEGORY_MAP = {
  drainage: "Drainage",
  drain: "Drainage",
  water: "Drainage",
  sewage: "Drainage",
  sewer: "Drainage",

  road_damage: "Road_Damage",
  "road damage": "Road_Damage",
  road: "Road_Damage",
  pothole: "Road_Damage",
  potholes: "Road_Damage",

  street_light: "Street_Light",
  "street light": "Street_Light",
  streetlight: "Street_Light",
  electricity: "Street_Light",
  electric: "Street_Light",
  light: "Street_Light",

  trash: "Trash",
  garbage: "Trash",
  sanitation: "Trash",
  waste: "Trash",
  other: "Trash",
};

const SUPERVISOR_ROLE_BY_CATEGORY = {
  Drainage: "supervisor_drainage",
  Road_Damage: "supervisor_road",
  Street_Light: "supervisor_streetlight",
  Trash: "supervisor_trash",
};

const FEEDBACK_RATINGS = ["Good", "Average", "Poor", "Worst"];

/* ---------------- HELPERS ---------------- */

function canonicalCategory(rawCategory) {
  if (!rawCategory || typeof rawCategory !== "string") return undefined;
  const normalized = rawCategory.trim().toLowerCase();
  return CATEGORY_MAP[normalized];
}

function normalizeCategory(rawCategory) {
  const canon = canonicalCategory(rawCategory);
  return canon !== undefined ? canon : rawCategory;
}

function supervisorRoleForCategory(rawCategory) {
  const normalized = canonicalCategory(rawCategory) || rawCategory;
  return SUPERVISOR_ROLE_BY_CATEGORY[normalized];
}

/* ---------------- SCHEMA ---------------- */

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
    },

    category: {
      type: String,
      enum: ["Drainage", "Road_Damage", "Street_Light", "Trash"],
      set: normalizeCategory,
    },

    assignedSupervisorRole: {
      type: String,
      enum: [
        "supervisor_trash",
        "supervisor_drainage",
        "supervisor_road",
        "supervisor_streetlight",
        null,
      ],
      default: null,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Assigned",
        "In Progress",
        "Completed",
        "Approved",
        "Rejected",
      ],
      default: "Submitted",
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    proofImageUrl: {
      type: String,
    },

    completionImage: {
      type: String,
    },

    completedAt: {
      type: Date,
    },

    location: {
      address: String,
      lat: Number,
      lng: Number,
    },

    timeline: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    feedback: {
      rating: {
        type: String,
        enum: FEEDBACK_RATINGS,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      submittedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

/* ---------------- COMPATIBILITY SYNC ---------------- */

complaintSchema.pre("save", function () {
  if (!this.createdBy && this.user) {
    this.createdBy = this.user;
  }

  if (this.createdBy && !this.user) {
    this.user = this.createdBy;
  }

  if (!this.assignedTo && this.assignedWorker) {
    this.assignedTo = this.assignedWorker;
  }

  if (this.assignedTo && !this.assignedWorker) {
    this.assignedWorker = this.assignedTo;
  }

  if (!this.title && this.description) {
    this.title = this.description.slice(0, 80);
  }

  if (!this.assignedSupervisorRole && this.category) {
    this.assignedSupervisorRole =
      supervisorRoleForCategory(this.category) || null;
  }
});

/* ---------------- STATIC HELPERS ---------------- */

complaintSchema.statics.normalizeCategory = normalizeCategory;
complaintSchema.statics.canonicalCategory = canonicalCategory;
complaintSchema.statics.supervisorRoleForCategory = supervisorRoleForCategory;
complaintSchema.statics.CATEGORY_MAP = CATEGORY_MAP;
complaintSchema.statics.SUPERVISOR_ROLE_BY_CATEGORY =
  SUPERVISOR_ROLE_BY_CATEGORY;
complaintSchema.statics.FEEDBACK_RATINGS = FEEDBACK_RATINGS;

complaintSchema.statics.fixCategories = async function () {
  const complaints = await this.find({});
  for (const doc of complaints) {
    let changed = false;
    const norm = normalizeCategory(doc.category);
    if (norm && norm !== doc.category) {
      doc.category = norm;
      changed = true;
    }
    if (changed) {
      await doc.save();
    }
  }
};

module.exports = mongoose.model("Complaint", complaintSchema);