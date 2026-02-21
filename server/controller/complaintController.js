const Complaint = require("../models/Complaint");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const FLASK_URL = "http://127.0.0.1:5000";

// Create Complaint
const createComplaint = async (req, res, next) => {
  try {
    let textResult = null;
    let imageResult = null;

    // ---------------------
    // TEXT CLASSIFICATION
    // ---------------------
    if (req.body.description) {
      const textResponse = await axios.post(
        `${FLASK_URL}/classify-text`,
        { text: req.body.description }
      );

      textResult = textResponse.data; 
      // { classification, confidence }
    }

    // ---------------------
    // IMAGE CLASSIFICATION
    // ---------------------
    if (req.file) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));

      const imageResponse = await axios.post(
        `${FLASK_URL}/classify-image`,
        formData,
        { headers: formData.getHeaders() }
      );

      imageResult = imageResponse.data;
    }

    // ---------------------
    // FINAL CATEGORY LOGIC
    // ---------------------
    let finalCategory = null;

    if (textResult && imageResult) {
      if (textResult.classification === imageResult.classification) {
        finalCategory = textResult.classification;
      } else {
        finalCategory =
          textResult.confidence > imageResult.confidence
            ? textResult.classification
            : imageResult.classification;
      }
    } 
    else if (textResult) {
      finalCategory = textResult.classification;
    } 
    else if (imageResult) {
      finalCategory = imageResult.classification;
    }

    // ---------------------
    // SAVE TO DATABASE
    // ---------------------
    const complaint = await Complaint.create({
      description: req.body.description,
      user: req.user._id,
      category: finalCategory,
      priority: req.body.priority,
      location: req.body.location
    });

    res.status(201).json(complaint);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint
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
