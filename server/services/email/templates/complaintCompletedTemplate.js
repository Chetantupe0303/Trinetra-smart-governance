function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCompletionDate(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleString("en-IN", { hour12: true });
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildComplaintCompletedEmailTemplate({
  citizenName,
  complaintId,
  description,
  category,
  completionDate,
  supervisorName,
}) {
  const safeCitizenName = escapeHtml(citizenName || "Citizen");
  const safeComplaintId = escapeHtml(complaintId || "-");
  const safeDescription = escapeHtml(description || "-");
  const safeCategory = escapeHtml(category || "-");
  const safeSupervisorName = escapeHtml(supervisorName || "Supervisor");
  const safeCompletionDate = escapeHtml(formatCompletionDate(completionDate));

  const subject = `Complaint Resolved: ${safeComplaintId}`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; margin:0; padding:24px;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden;">
      <div style="padding:16px 20px; background:#0f172a; color:#ffffff;">
        <h2 style="margin:0; font-size:18px;">Smart Governance Complaint Update</h2>
      </div>
      <div style="padding:20px;">
        <p style="margin:0 0 12px;">Dear ${safeCitizenName},</p>
        <p style="margin:0 0 16px;">
          Your complaint has been marked as <strong>Completed</strong>. Please find the details below:
        </p>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="padding:8px; border:1px solid #e2e8f0; background:#f8fafc; width:35%;"><strong>Complaint ID</strong></td>
            <td style="padding:8px; border:1px solid #e2e8f0;">${safeComplaintId}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Description</strong></td>
            <td style="padding:8px; border:1px solid #e2e8f0;">${safeDescription}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Category</strong></td>
            <td style="padding:8px; border:1px solid #e2e8f0;">${safeCategory}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Completion Date</strong></td>
            <td style="padding:8px; border:1px solid #e2e8f0;">${safeCompletionDate}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e2e8f0; background:#f8fafc;"><strong>Supervisor</strong></td>
            <td style="padding:8px; border:1px solid #e2e8f0;">${safeSupervisorName}</td>
          </tr>
        </table>
        <p style="margin:16px 0 0;">
          Thank you for helping us improve city services through the Smart Governance platform.
        </p>
      </div>
    </div>
  </div>`;

  const text = [
    `Dear ${citizenName || "Citizen"},`,
    "",
    "Your complaint has been marked as Completed.",
    `Complaint ID: ${complaintId || "-"}`,
    `Description: ${description || "-"}`,
    `Category: ${category || "-"}`,
    `Completion Date: ${formatCompletionDate(completionDate)}`,
    `Supervisor: ${supervisorName || "Supervisor"}`,
    "",
    "Thank you for helping us improve city services through Smart Governance.",
  ].join("\n");

  return { subject, html, text };
}

module.exports = { buildComplaintCompletedEmailTemplate };
