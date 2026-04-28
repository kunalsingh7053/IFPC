const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    items: {
      type: String,
      required: true,
      trim: true,
    },

    paidBy: {
      type: String,
      required: true,
      trim: true,
    },

    paidTo: {
      type: String,
      required: true,
      trim: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "bank-transfer", "upi", "cheque", "other"],
      default: "cash",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    remark: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("funds", fundsSchema);
