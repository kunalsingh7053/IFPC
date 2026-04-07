const Equipment = require("../models/equipment.model");
const EquipmentIssue = require("../models/equipmentIssue.model");

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function appendHistory(issue, status, note, changedByType, changedById = null) {
  issue.history.push({
    status,
    note: String(note || "").trim(),
    changedByType,
    changedById,
    changedAt: new Date(),
  });
}

function normalizeIssue(issue) {
  return {
    _id: issue._id,
    memberId: issue.memberId,
    equipmentId: issue.equipmentId,
    equipmentName: issue.equipmentName,
    equipmentCategory: issue.equipmentCategory,
    equipmentImageUrl: issue.equipmentImageUrl,
    purpose: issue.purpose,
    useFrom: issue.useFrom,
    useTo: issue.useTo,
    status: issue.status,
    adminNote: issue.adminNote,
    approvedBy: issue.approvedBy,
    approvedAt: issue.approvedAt,
    receivedAt: issue.receivedAt,
    returnedAt: issue.returnedAt,
    history: issue.history,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

async function createEquipmentIssue(req, res) {
  try {
    const memberId = req.user?._id;
    const equipmentId = req.body?.equipmentId || null;
    const customEquipmentName = String(req.body?.customEquipmentName || "").trim();
    const purpose = String(req.body?.purpose || "").trim();
    const useFrom = parseDate(req.body?.useFrom);
    const useTo = parseDate(req.body?.useTo);

    if (!purpose || !useFrom || !useTo) {
      return res.status(400).json({
        success: false,
        message: "purpose, useFrom and useTo are required",
      });
    }

    if (useTo <= useFrom) {
      return res.status(400).json({
        success: false,
        message: "useTo must be after useFrom",
      });
    }

    let equipmentName = customEquipmentName;
    let equipmentCategory = "";
    let equipmentImageUrl = "";
    let linkedEquipmentId = null;

    if (equipmentId) {
      const equipment = await Equipment.findById(equipmentId).select("name category imageUrl");
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Selected equipment not found",
        });
      }

      linkedEquipmentId = equipment._id;
      equipmentName = equipment.name;
      equipmentCategory = equipment.category;
      equipmentImageUrl = equipment.imageUrl;
    }

    if (!equipmentName) {
      return res.status(400).json({
        success: false,
        message: "Select equipment or enter customEquipmentName",
      });
    }

    const issue = new EquipmentIssue({
      memberId,
      equipmentId: linkedEquipmentId,
      equipmentName,
      equipmentCategory,
      equipmentImageUrl,
      purpose,
      useFrom,
      useTo,
      status: "pending",
      history: [],
    });

    appendHistory(issue, "pending", "Issue request created", "member", memberId);

    await issue.save();

    return res.status(201).json({
      success: true,
      message: "Equipment issue request created",
      data: normalizeIssue(issue),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyEquipmentIssues(req, res) {
  try {
    const memberId = req.user?._id;

    const issues = await EquipmentIssue.find({ memberId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllEquipmentIssues(req, res) {
  try {
    const issues = await EquipmentIssue.find({})
      .populate("memberId", "fullName email position")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: issues.map((issue) => ({
        ...normalizeIssue(issue),
        member: issue.memberId
          ? {
              _id: issue.memberId._id,
              fullName: issue.memberId.fullName,
              email: issue.memberId.email,
              position: issue.memberId.position,
            }
          : null,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateEquipmentIssueStatus(req, res) {
  try {
    const { id } = req.params;
    const nextStatus = String(req.body?.status || "").trim().toLowerCase();
    const adminNote = String(req.body?.adminNote || "").trim();

    const allowedStatuses = ["approved", "rejected", "received", "returned"];

    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "status must be approved, rejected, received, or returned",
      });
    }

    const issue = await EquipmentIssue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue request not found",
      });
    }

    const current = issue.status;
    const validTransitions = {
      pending: ["approved", "rejected"],
      approved: ["received"],
      received: ["returned"],
      rejected: [],
      returned: [],
    };

    if (!validTransitions[current].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot move status from ${current} to ${nextStatus}`,
      });
    }

    issue.status = nextStatus;
    issue.adminNote = adminNote;

    if (nextStatus === "approved") {
      issue.approvedBy = req.admin?._id || null;
      issue.approvedAt = new Date();
    }

    if (nextStatus === "received") {
      issue.receivedAt = new Date();
    }

    if (nextStatus === "returned") {
      issue.returnedAt = new Date();
    }

    appendHistory(
      issue,
      nextStatus,
      adminNote || `Status changed to ${nextStatus}`,
      "admin",
      req.admin?._id || null
    );

    await issue.save();

    return res.json({
      success: true,
      message: `Issue status updated to ${nextStatus}`,
      data: normalizeIssue(issue),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createEquipmentIssue,
  getMyEquipmentIssues,
  getAllEquipmentIssues,
  updateEquipmentIssueStatus,
};
