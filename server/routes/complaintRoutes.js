const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controller/complaintController");

router.post("/", createComplaint);
router.get("/", getAllComplaints);
router.patch("/:id/status", updateComplaintStatus);

module.exports = router;
