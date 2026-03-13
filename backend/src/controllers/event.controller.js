const Event = require("../models/events.model");
const { uploadImage, uploadMultiple } = require("../service/imagekit.service");

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
    if (req.files?.thumbnail) {
      thumbnailUrl = await uploadImage(
        req.files.thumbnail[0],
        "events/thumbnails"
      );
    }

    let imageUrls = [];
    if (req.files?.images) {
      imageUrls = await uploadMultiple(
        req.files.images,
        "events/gallery"
      );
    }

    const event = await Event.create({
      title,
      description,
      eventDate,
      location,
      thumbnail: thumbnailUrl,
      images: imageUrls,
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
      const url = await uploadImage(req.files.thumbnail[0], "events/thumbnails");
      event.thumbnail = url;
    }

    if (req.files?.images) {
      const urls = await uploadMultiple(req.files.images, "events/gallery");
      event.images = urls;
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

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = { getEvents, getEventById, createEvent, updateEvent , deleteEvent };