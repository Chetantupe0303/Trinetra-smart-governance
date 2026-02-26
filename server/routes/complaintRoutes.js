const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
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
} = require("../controller/complaintController"); // ✅ FIXED
const { getWorkers } = require("../controller/adminController");

router.post("/complaints", protect, upload.single("image"), createComplaint);

router.get("/complaints", protect, complaintScope, getAllComplaints);
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

router.patch("/:id/worker-update", protect, async (req, res) => {
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
    updatedBy: req.user._id, // 🔥 use _id now
  });

  await complaint.save();

  res.json({ message: "Updated successfully" });
});

module.exports = router;
