// Adds a Mongo filter to req.complaintScope based on authenticated role.
// Admin: all complaints
// Supervisors: only own mapped category and active complaints.
// Completed complaints remain visible for 8 hours after completion.
// Others: personal visibility handled in controller
const SUPERVISOR_ROLE_CATEGORY_MAP = {
  supervisor: "Trash",
  supervisor_trash: "Trash",
  supervisor_drainage: "Drainage",
  supervisor_road: "Road_Damage",
  supervisor_streetlight: "Street_Light",
};

const complaintScope = (req, res, next) => {
  if (!req.user) {
    req.complaintScope = {};
    return next();
  }

  if (req.user.role === "admin") {
    req.complaintScope = {};
    return next();
  }

  const supervisorCategory = SUPERVISOR_ROLE_CATEGORY_MAP[req.user.role];
  if (supervisorCategory) {
    const completedVisibleSince = new Date(Date.now() - 8 * 60 * 60 * 1000);

    req.complaintScope = {
      $and: [
        {
          $or: [
            { status: { $ne: "Completed" } },
            {
              status: "Completed",
              completedAt: { $gte: completedVisibleSince },
            },
          ],
        },
      ],
      $or: [
        { assignedSupervisorRole: req.user.role },
        {
          assignedSupervisorRole: { $in: [null, undefined] },
          category: supervisorCategory,
        },
      ],
    };
    return next();
  }

  req.complaintScope = {};
  return next();
};

module.exports = { complaintScope };
