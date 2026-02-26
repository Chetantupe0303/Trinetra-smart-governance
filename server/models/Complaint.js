const mongoose = require("mongoose");

// a simple mapping used for normalizing incoming text and for fix‑ups
const CATEGORY_MAP = {
  drainage: "Drainage",
  road_damage: "Road_Damage",
  "road damage": "Road_Damage",
  street_light: "Street_Light",
  "street light": "Street_Light",
  trash: "Trash",
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

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
complaintSchema.statics.CATEGORY_MAP = CATEGORY_MAP;

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

module.exports = mongoose.model("Complaint", complaintSchema);