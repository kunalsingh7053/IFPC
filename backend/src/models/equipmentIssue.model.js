const mongoose = require("mongoose");

const issueHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "received", "returned"],
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    changedByType: {
      type: String,
      enum: ["member", "admin", "system"],
      default: "system",
    },
    changedById: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const equipmentIssueSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members",
      required: true,
      index: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      default: null,
    },
    equipmentName: {
      type: String,
      required: true,
      trim: true,
    },
    equipmentCategory: {
      type: String,
      trim: true,
      default: "",
    },
    equipmentImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    useFrom: {
      type: Date,
      required: true,
    },
    useTo: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "received", "returned"],
      default: "pending",
      index: true,
    },
    adminNote: {
      type: String,
      trim: true,
      default: "",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    history: {
      type: [issueHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const EquipmentIssue = mongoose.model("EquipmentIssue", equipmentIssueSchema);

module.exports = EquipmentIssue;
