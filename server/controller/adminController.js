const Complaint = require("../models/Complaint");
const User = require("../models/users");

// Assign Worker (single or bulk)
exports.assignWorker = async (req, res) => {
  try {
    const { complaintId, complaintIds, workerId } = req.body;

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ message: "Invalid worker" });
    }

    const targetComplaintIds = Array.isArray(complaintIds)
      ? complaintIds.filter(Boolean)
      : complaintId
      ? [complaintId]
      : [];

    if (targetComplaintIds.length === 0) {
      return res.status(400).json({ message: "complaintId or complaintIds is required" });
    }

    const complaints = await Complaint.find({ _id: { $in: targetComplaintIds } });

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found" });
    }

    complaints.forEach((complaint) => {
      // make sure category gets normalized in case an old doc has a
      // non‑standard value; we only want to substitute a canonical
      // value when one exists, otherwise leave it untouched so the
      // schema validation can catch it later if it's really bogus.
      const canonical = Complaint.canonicalCategory(complaint.category);
      if (canonical) {
        complaint.category = canonical;
      }

      complaint.assignedWorker = workerId;
      complaint.assignedTo = workerId;
      complaint.status = "Assigned";
      complaint.timeline.push({
        status: "Assigned",
        updatedBy: req.user._id,
        note: "Complaint assigned to worker",
      });
    });

    await Promise.all(complaints.map((complaint) => complaint.save()));

    if (targetComplaintIds.length === 1) {
      return res.json({ message: "Worker assigned successfully", assignedCount: 1 });
    }

    res.json({
      message: `Worker assigned to ${complaints.length} complaints successfully`,
      assignedCount: complaints.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// List users by role for admin dashboard tabs
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const allowedRoles = ["supervisor", "worker", "citizen"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role filter" });
    }

    let filter = { role };
    if (role === "supervisor") {
      filter = {
        role: {
          $in: [
            "supervisor_trash",
            "supervisor_drainage",
            "supervisor_road",
            "supervisor_streetlight",
          ],
        },
      };
    }

    const users = await User.find(filter).select("name email role credits createdAt");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin can view all complaints
exports.getAllComplaintsForAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("createdBy", "name email")
      .populate("assignedWorker", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin map view should only include active complaints (not completed)
exports.getActiveComplaintPins = async (req, res) => {
  try {
    const activeComplaints = await Complaint.find({ status: { $ne: "Completed" } })
      .select("title description category priority status location createdAt");

    res.json(activeComplaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all workers
exports.getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select("name email");
    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve Complaint
exports.approveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Approved";
    await complaint.save();

    // Give credits to citizen
    const citizen = await User.findById(complaint.user);
    citizen.credits += 10;
    await citizen.save();

    res.json({ message: "Complaint approved & credits added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject Complaint
exports.rejectComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findById(complaintId);

    complaint.status = "Rejected";
    await complaint.save();

    res.json({ message: "Complaint rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
