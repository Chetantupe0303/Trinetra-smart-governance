const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { complaintScope } = require("../middleware/complaintScopeMiddleware");

const multer = require("multer");
const Complaint = require("../models/Complaint");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  submitComplaintFeedback,
  sendCompletionEmailToCitizen,
} = require("../controller/complaintController");

const { getWorkers } = require("../controller/adminController");

/* ===================== CREATE ===================== */

router.post(
  "/complaints",
  protect,
  upload.single("image"),
  createComplaint
);

/* ===================== GET ===================== */

router.get(
  "/complaints",
  protect,
  complaintScope,
  getAllComplaints
);

/* ===================== GET WORKERS ===================== */

router.get(
  "/complaints/workers",
  protect,
  authorizeRoles(
    "admin",
    "supervisor",
    "supervisor_trash",
    "supervisor_drainage",
    "supervisor_road",
    "supervisor_streetlight"
  ),
  getWorkers
);

/* ===================== UPDATE STATUS ===================== */

router.patch(
  "/complaints/:id/status",
  protect,
  complaintScope,
  authorizeRoles(
    "admin",
    "supervisor",
    "supervisor_trash",
    "supervisor_drainage",
    "supervisor_road",
    "supervisor_streetlight"
  ),
  updateComplaintStatus
);

/* ===================== FEEDBACK ===================== */

router.post(
  "/complaints/:id/feedback",
  protect,
  submitComplaintFeedback
);

router.post(
  "/complaints/:id/send-completion-email",
  protect,
  complaintScope,
  authorizeRoles(
    "admin",
    "supervisor",
    "supervisor_trash",
    "supervisor_drainage",
    "supervisor_road",
    "supervisor_streetlight"
  ),
  sendCompletionEmailToCitizen
);

/* ===================== WORKER UPDATE ===================== */

router.patch("/:id/worker-update", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ message: "Not found" });

    complaint.status = req.body.status;

    if (req.body.completionImage) {
      complaint.completionImage = req.body.completionImage;
      complaint.completedAt = new Date();
    }

    complaint.timeline.push({
      status: req.body.status,
      updatedBy: req.user._id,
    });

    await complaint.save();

    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
