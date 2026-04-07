const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    memberRegistrationOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);

module.exports = SystemSetting;
