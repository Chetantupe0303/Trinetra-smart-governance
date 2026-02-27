const Complaint = require("../models/Complaint");
const User = require("../models/users");
const axios = require("axios");
const FormData = require("form-data");
const cloudinary = require("../config/cloudinary");

const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const isSupervisorRole =
  (role) => typeof role === "string" && (role === "supervisor" || role.startsWith("supervisor_"));

const DESCRIPTION_CATEGORY_HINTS = [
  { category: "Road_Damage", keywords: ["road", "pothole", "crack", "asphalt"] },
  { category: "Street_Light", keywords: ["street light", "streetlight", "light", "electric", "electricity"] },
  { category: "Drainage", keywords: ["drain", "drainage", "sewage", "sewer", "water logging", "water"] },
  { category: "Trash", keywords: ["trash", "garbage", "waste", "sanitation", "dump"] },
];

function inferCategoryFromDescription(description) {
  if (typeof description !== "string") {
    return undefined;
  }

  const text = description.toLowerCase();
  for (const hint of DESCRIPTION_CATEGORY_HINTS) {
    if (hint.keywords.some((keyword) => text.includes(keyword))) {
      return hint.category;
    }
  }

  return undefined;
}

async function geocodeAddress(address) {
  if (!address) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
    });

    const response = await axios.get(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "Trinetra-smart-governance/1.0",
      },
      timeout: 8000,
    });

    const [firstResult] = response.data;
    if (!firstResult) {
      return null;
    }

    const lat = Number(firstResult.lat);
    const lng = Number(firstResult.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error("Location geocoding failed:", error.message);
    return null;
  }
}

async function buildLocationPayload(rawLocation, rawLatitude, rawLongitude, rawAddress) {
  const latFromBody = Number(rawLatitude);
  const lngFromBody = Number(rawLongitude);
  const addressFromBody =
    typeof rawAddress === "string" && rawAddress.trim() ? rawAddress.trim() : "";

  if (Number.isFinite(latFromBody) && Number.isFinite(lngFromBody)) {
    return {
      address: addressFromBody || undefined,
      lat: latFromBody,
      lng: lngFromBody,
    };
  }

  if (!rawLocation) {
    if (addressFromBody) {
      const geocoded = await geocodeAddress(addressFromBody);
      return {
        address: addressFromBody,
        lat: geocoded?.lat,
        lng: geocoded?.lng,
      };
    }
    return undefined;
  }

  let parsedLocation = rawLocation;

  if (typeof rawLocation === "string") {
    const locationString = rawLocation.trim();
    if (!locationString) {
      return undefined;
    }

    try {
      parsedLocation = JSON.parse(locationString);
    } catch {
      const geocoded = await geocodeAddress(locationString);
      return {
        address: locationString,
        lat: geocoded?.lat,
        lng: geocoded?.lng,
      };
    }
  }

  if (typeof parsedLocation === "object" && parsedLocation !== null) {
    const address =
      typeof parsedLocation.address === "string"
        ? parsedLocation.address.trim()
        : "";
    const lat = Number(parsedLocation.lat);
    const lng = Number(parsedLocation.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return {
        address: address || undefined,
        lat,
        lng,
      };
    }

    if (address || addressFromBody) {
      const finalAddress = address || addressFromBody;
      const geocoded = await geocodeAddress(finalAddress);
      return {
        address: finalAddress,
        lat: geocoded?.lat,
        lng: geocoded?.lng,
      };
    }
  }

  return undefined;
}

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

    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    let imageResult = null;

    // // ---------------------
    // // TEXT CLASSIFICATION
    // // ---------------------
    // //if (description) {
    // //  try {
    // //    const textResponse = await axios.post(
    // //      `${FLASK_URL}/classify-text`,
    // //      { text: description }
    // //    );
    //     textResult = textResponse.data; // { classification, confidence }
    //   } catch (e) {
    //     console.error("Text classification failed:", e.response?.data || e.message);
    //   }
    // }

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
    const finalCategory =
      imageResult?.classification ||
      req.body.category ||
      inferCategoryFromDescription(description) ||
      "Trash";

    // normalize using the model helper — this will also work if we
    // accidentally receive an already-canonical value, since the
    // setter on the schema will keep it unchanged.
    // first try to translate to a canonical value; if that fails we
    // treat it as unsupported
    const normalizedCategory = Complaint.canonicalCategory(finalCategory);
    if (finalCategory && !normalizedCategory) {
      return res.status(400).json({
        success: false,
        message: `Unsupported category: ${finalCategory}`,
      });
    }

    // ---------------------
    // SAVE TO DATABASE
    // ---------------------
    const locationPayload = await buildLocationPayload(
      req.body.location,
      req.body.latitude,
      req.body.longitude,
      req.body.locationAddress
    );

    const complaintPayload = {
      title:
        typeof req.body.title === "string" && req.body.title.trim()
          ? req.body.title.trim()
          : description.slice(0, 80),
      description,
      user: req.user._id,
      createdBy: req.user._id,
      category: normalizedCategory,
      assignedSupervisorRole: Complaint.supervisorRoleForCategory(normalizedCategory) || null,
      priority: req.body.priority,
      location: locationPayload,
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
      complaints = await Complaint.find(req.complaintScope || {})
        .populate("user", "name email")
        .populate("createdBy", "name email")
        .populate("assignedWorker", "name email");
    } else if (isSupervisorRole(req.user.role)) {
      complaints = await Complaint.find(req.complaintScope || {})
        .populate("user", "name email")
        .populate("createdBy", "name email")
        .populate("assignedWorker", "name email");
    } else if (req.user.role === "worker") {
      complaints = await Complaint.find({ assignedWorker: req.user._id })
        .populate("user", "name email")
        .populate("createdBy", "name email")
        .populate("assignedWorker", "name email");
    } else {
      complaints = await Complaint.find({ user: req.user._id })
        .populate("user", "name email")
        .populate("createdBy", "name email")
        .populate("assignedWorker", "name email");
    }

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// Update Status
const updateComplaintStatus = async (req, res , next) => {
  try {
    const { status, workerId } = req.body;
    let resolvedWorkerId = workerId;

    if (status === "Assigned") {
      if (resolvedWorkerId) {
        const worker = await User.findById(resolvedWorkerId);
        if (!worker || worker.role !== "worker") {
          return res.status(400).json({
            success: false,
            message: "Invalid workerId.",
          });
        }
      } else {
        const availableWorkers = await User.find({ role: "worker" }).select("_id");
        if (!availableWorkers.length) {
          return res.status(400).json({
            success: false,
            message: "No workers are available for assignment.",
          });
        }

        const workerIds = availableWorkers.map((worker) => worker._id);
        const activeCounts = await Complaint.aggregate([
          {
            $match: {
              assignedWorker: { $in: workerIds },
              status: { $in: ["Assigned", "In Progress"] },
            },
          },
          {
            $group: {
              _id: "$assignedWorker",
              count: { $sum: 1 },
            },
          },
        ]);

        const countByWorker = new Map(
          activeCounts.map((item) => [String(item._id), item.count])
        );

        availableWorkers.sort((a, b) => {
          const countA = countByWorker.get(String(a._id)) || 0;
          const countB = countByWorker.get(String(b._id)) || 0;
          return countA - countB;
        });

        resolvedWorkerId = availableWorkers[0]._id;
      }
    }

    const filter = { _id: req.params.id };
    if (isSupervisorRole(req.user.role)) {
      Object.assign(filter, req.complaintScope || {});
    }

    const update = { status };
    if (status === "Assigned") {
      update.assignedWorker = resolvedWorkerId;
      update.assignedTo = resolvedWorkerId;
      update.$push = {
        timeline: {
          status: "Assigned",
          updatedBy: req.user._id,
          note: workerId
            ? "Complaint assigned to worker"
            : "Complaint auto-assigned to least-loaded worker",
        },
      };
    }

    const updatedComplaint = await Complaint.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    })
      .populate("user", "name email")
      .populate("createdBy", "name email")
      .populate("assignedWorker", "name email");

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found or access denied" });
    }

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
