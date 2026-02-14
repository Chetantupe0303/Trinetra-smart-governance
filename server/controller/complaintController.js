const Complaint = require("../models/Complaint");

// Create Complaint
const createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};


// Get All Complaints
const getAllComplaints = async (req, res, next) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      complaints = await Complaint.find().populate("user", "name email");
    } else {
      complaints = await Complaint.find({ user: req.user._id });
    }

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};


// Update Status
const updateComplaintStatus = async (req, res , next) => {
  try {
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedComplaint);
  } catch (error) {
  next(error);
}
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
};
