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
    // Store image inline in DB as a Data URL string for easy rendering.
    image: {
      data: { type: String }, // e.g., "data:image/jpeg;base64,..."
      contentType: { type: String }
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
    // Store location as a free-form address string provided by the client.
    // If you later add geocoding, you can extend this to include lat/lng.
    location: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
