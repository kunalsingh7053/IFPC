const express = require("express");
const { adminAuthMiddleware } = require("../middleware/admin.middleware");
const equipmentController = require("../controllers/equipment.controller");

const router = express.Router();

router.get("/", equipmentController.getEquipment);
router.post("/", adminAuthMiddleware, equipmentController.createEquipment);
router.patch("/:id", adminAuthMiddleware, equipmentController.updateEquipment);

module.exports = router;
