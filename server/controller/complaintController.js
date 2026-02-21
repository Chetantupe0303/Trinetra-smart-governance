const Complaint = require("../models/Complaint");
const axios = require("axios");
const FormData = require("form-data");
const cloudinary = require("../config/cloudinary");

const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";

// Create Complaint
const createComplaint = async (req, res, next) => {
  try {
    // Admins cannot submit complaints, only view them
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins are not allowed to submit complaints. They can only view and manage complaints."
      });
    }

    let textResult = null;
    let imageResult = null;

    // ---------------------
    // TEXT CLASSIFICATION
    // ---------------------
    if (req.body.description) {
      try {
        const textResponse = await axios.post(
          `${FLASK_URL}/classify-text`,
          { text: req.body.description }
        );
        textResult = textResponse.data; // { classification, confidence }
      } catch (e) {
        console.error("Text classification failed:", e.response?.data || e.message);
      }
    }

    // ---------------------
    // IMAGE CLASSIFICATION
    // ---------------------
    if (req.file && req.file.buffer) {
      try {
        const formData = new FormData();
        formData.append("file", req.file.buffer, {
          filename: req.file.originalname || `upload-${Date.now()}`,
          contentType: req.file.mimetype || "image/jpeg",
        });

        const imageResponse = await axios.post(
          `${FLASK_URL}/classify-image`,
          formData,
          { headers: formData.getHeaders() }
        );
        imageResult = imageResponse.data;
      } catch (e) {
        console.error("Image classification failed:", e.response?.data || e.message);
      }
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
    const complaintPayload = {
      description: req.body.description,
      user: req.user._id,
      category: finalCategory,
      priority: req.body.priority,
      location: req.body.location,
    };

    if (req.file && req.file.buffer) {
      // Persist image in DB as a Data URL and upload to Cloudinary
      const mime = req.file.mimetype || "image/jpeg";
      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${mime};base64,${base64}`;
      complaintPayload.image = {
        data: dataUri,
        contentType: mime,
      };
      try {
        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "complaints",
          resource_type: "image",
        });
        complaintPayload.imageUrl = uploadRes.secure_url;
      } catch (e) {
        console.error("Cloudinary upload failed:", e.response?.data || e.message);
      }
    }

    const complaint = await Complaint.create(complaintPayload);
    
    // Populate the user data in the response
    const populatedComplaint = await Complaint.findById(complaint._id).populate("user", "name email");

    res.status(201).json(populatedComplaint);

  } catch (error) {
    console.error("Create complaint error:", error.message);
    next(error);
  }
};

// Get All Complaints
const getAllComplaints = async (req, res, next) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      console.log(`Admin ${req.user.name} & ${req.user.role} is fetching all complaints`);
      complaints = await Complaint.find().populate("user", "name email");
    } else {
      complaints = await Complaint.find({ user: req.user._id }).populate("user", "name email");
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
    ).populate("user", "name email");

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
