const Complaint = require("../models/Complaint");

// Create Complaint
const createComplaint = async (req, res , next) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  }
  catch (error) {
  next(error);
}

};

// Get All Complaints
const getAllComplaints = async (req, res , next) => {
  try {
    const complaints = await Complaint.find();
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
