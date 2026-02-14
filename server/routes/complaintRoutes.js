const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controller/complaintController");

router.post("/", protect, createComplaint);

router.get("/", protect, getAllComplaints);

router.patch("/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = router;
