const express = require('express');
const { adminAuthMiddleware } = require('../middleware/admin.middleware');
const eventController = require('../controllers/event.controller');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

// Public routes: anyone can see events
router.get('/', eventController.getEvents); // list
router.get('/:id', eventController.getEventById); // detail

router.post(
  '/',
  adminAuthMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  eventController.createEvent
);
router.patch(
  "/:id",
  adminAuthMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  eventController.updateEvent
);
router.delete(
  "/:id",
  adminAuthMiddleware,
  eventController.deleteEvent
);
module.exports = router;