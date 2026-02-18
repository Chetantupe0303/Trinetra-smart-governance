const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {

      user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      required: true,
       trim: true
    },
    imageUrl: {
      type: String
    },
    category: {
      type: String,
      enum: ["Drainage", "Road_Damage", "Street_Light", "Trash"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending"
    },
    location: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
