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
      enum: ["Drainage", "Road-Damage", "Street-Light", "Trash"],
    },

    priority: {
      type: String,
      enum: ["Low Priority", "Medium Priority", "High Priority"],
      default: "Medium Priority",
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

const Complaints = mongoose.model("Complaint", complaintSchema);
module.exports = Complaints;