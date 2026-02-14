const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
       trim: true
    },
    imageUrl: {
      type: String
    },
    category: {
      type: String
    },
    priority: {
      type: String
    },
    status: {
      type: String,
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
