const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const multer = require("multer");
const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controller/complaintController");

const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("image"), createComplaint);

router.get("/", protect, getAllComplaints);

router.patch("/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = router;
