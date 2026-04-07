const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    eventDate: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      trim: true
    },

    thumbnail: {
      type: String, // ImageKit URL
      required: true
    },

    thumbnailFileId: {
      type: String,
      default: null
    },

    images: {
      type: [String], // ImageKit URLs
      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: "Maximum 5 images allowed"
      },
      default: []
    },

    imageFileIds: {
      type: [String],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;