const Event = require("../models/events.model");
const {
  uploadImageAsset,
  uploadMultipleAssets,
  deleteImagesByFileIds,
} = require("../service/imagekit.service");

// Public: get all events (no login required)
async function getEvents(req, res) {
  try {
    // Exclude the full images array from the list view
    const events = await Event.find({}, "title description eventDate location thumbnail createdBy")
      .sort({ eventDate: 1 });

    return res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Public: get single event by id (full details + photos)
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, eventDate, location } = req.body;

    // validate required
    if (!title || !eventDate) {
      return res.status(400).json({ message: "Title and eventDate required" });
    }

    // thumbnail limit check
    if (req.files?.thumbnail && req.files.thumbnail.length > 1) {
      return res.status(400).json({ message: "Only 1 thumbnail allowed" });
    }

    // images limit check
    if (req.files?.images && req.files.images.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed" });
    }

    let thumbnailUrl = null;
    let thumbnailFileId = null;
    if (req.files?.thumbnail) {
      const thumbnailAsset = await uploadImageAsset(
        req.files.thumbnail[0],
        "events/thumbnails"
      );
      thumbnailUrl = thumbnailAsset.url;
      thumbnailFileId = thumbnailAsset.fileId;
    }

    let imageUrls = [];
    let imageFileIds = [];
    if (req.files?.images) {
      const imageAssets = await uploadMultipleAssets(
        req.files.images,
        "events/gallery"
      );
      imageUrls = imageAssets.map((asset) => asset.url);
      imageFileIds = imageAssets.map((asset) => asset.fileId);
    }

    const event = await Event.create({
      title,
      description,
      eventDate,
      location,
      thumbnail: thumbnailUrl,
      thumbnailFileId,
      images: imageUrls,
      imageFileIds,
      createdBy: req.admin._id
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, description, eventDate, location } = req.body || {};

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // files check
    if (req.files?.thumbnail && req.files.thumbnail.length > 1) {
      return res.status(400).json({ message: "Only 1 thumbnail allowed" });
    }

    if (req.files?.images && req.files.images.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed" });
    }

    if (req.files?.thumbnail) {
      const oldThumbnailFileId = event.thumbnailFileId;
      const thumbnailAsset = await uploadImageAsset(req.files.thumbnail[0], "events/thumbnails");
      event.thumbnail = thumbnailAsset.url;
      event.thumbnailFileId = thumbnailAsset.fileId;

      if (oldThumbnailFileId) {
        await deleteImagesByFileIds([oldThumbnailFileId]);
      }
    }

    if (req.files?.images) {
      const oldImageFileIds = event.imageFileIds || [];
      const imageAssets = await uploadMultipleAssets(req.files.images, "events/gallery");
      event.images = imageAssets.map((asset) => asset.url);
      event.imageFileIds = imageAssets.map((asset) => asset.fileId);

      if (oldImageFileIds.length > 0) {
        await deleteImagesByFileIds(oldImageFileIds);
      }
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (eventDate !== undefined) event.eventDate = eventDate;
    if (location !== undefined) event.location = location;

    await event.save();

    res.json({ message: "Event updated", event });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fileIdsToDelete = [
      event.thumbnailFileId,
      ...(event.imageFileIds || []),
    ].filter(Boolean);

    if (fileIdsToDelete.length > 0) {
      await deleteImagesByFileIds(fileIdsToDelete);
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = { getEvents, getEventById, createEvent, updateEvent , deleteEvent };