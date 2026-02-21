const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const multer = require("multer");
// Use in-memory storage; we'll upload to Cloudinary and avoid writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controller/complaintController");

router.post("/complaints", protect, upload.single("image"), createComplaint);

router.get("/complaints", protect, getAllComplaints);

router.patch("/complaints/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = router;
