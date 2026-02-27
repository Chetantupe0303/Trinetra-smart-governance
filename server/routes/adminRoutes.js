const express = require("express");
const router = express.Router();
const {
  assignWorker,
  getWorkers,
  approveComplaint,
  rejectComplaint,
  getUsersByRole,
  getAllComplaintsForAdmin,
  getActiveComplaintPins,
} = require("../controller/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/workers", protect, authorizeRoles("admin"), getWorkers);
router.get("/users/:role", protect, authorizeRoles("admin"), getUsersByRole);
router.get("/complaints", protect, authorizeRoles("admin"), getAllComplaintsForAdmin);
router.get("/map-pins", protect, authorizeRoles("admin"), getActiveComplaintPins);
router.post("/assign", protect, authorizeRoles("admin"), assignWorker);
router.post("/approve", protect, authorizeRoles("admin"), approveComplaint);
router.post("/reject", protect, authorizeRoles("admin"), rejectComplaint);

module.exports = router;
