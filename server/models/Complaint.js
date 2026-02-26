const mongoose = require("mongoose");

// a simple mapping used for normalizing incoming text and for fix‑ups
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

// return the canonical value from the map, or undefined if the input
// doesn't match any known key. this is what the controller should use
// to validate user‑supplied data.
function canonicalCategory(rawCategory) {
  if (!rawCategory || typeof rawCategory !== "string") {
    return undefined;
  }
  const normalized = rawCategory.trim().toLowerCase();
  return CATEGORY_MAP[normalized];
}

// general normalizer that returns a usable category string even when
// the input is already canonical or not recognized. used by the
// schema setter so that we don't accidentally wipe out an odd value.
function normalizeCategory(rawCategory) {
  const canon = canonicalCategory(rawCategory);
  return canon !== undefined ? canon : rawCategory;
}

function supervisorRoleForCategory(rawCategory) {
  const normalized = canonicalCategory(rawCategory) || rawCategory;
  return SUPERVISOR_ROLE_BY_CATEGORY[normalized];
}

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
      set: normalizeCategory, // automatically normalize before saving
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

    // ✅ Only this worker field is needed
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
  },
  { timestamps: true }
);

// expose helpers so other parts of the app can reuse the same logic
complaintSchema.statics.normalizeCategory = normalizeCategory;
complaintSchema.statics.canonicalCategory = canonicalCategory;
complaintSchema.statics.supervisorRoleForCategory = supervisorRoleForCategory;
complaintSchema.statics.CATEGORY_MAP = CATEGORY_MAP;
complaintSchema.statics.SUPERVISOR_ROLE_BY_CATEGORY = SUPERVISOR_ROLE_BY_CATEGORY;

// utility to scan and correct existing documents that have a non‑standard category
complaintSchema.statics.fixCategories = async function () {
  const allowed = Object.values(CATEGORY_MAP);
  const docs = await this.find({ category: { $nin: allowed } });
  for (const doc of docs) {
    const fixed = normalizeCategory(doc.category);
    if (fixed && fixed !== doc.category) {
      doc.category = fixed;
      await doc.save();
    }
  }
};

complaintSchema.pre("save", function syncCompatibilityFields() {
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
    this.assignedSupervisorRole = supervisorRoleForCategory(this.category) || null;
  }

});

module.exports = mongoose.model("Complaint", complaintSchema);
