const mongoose = require("mongoose");

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

module.exports = mongoose.model("Complaint", complaintSchema);