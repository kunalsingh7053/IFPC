const express = require("express");
const { memberAuthMiddleware } = require("../middleware/member.middleware");
const { adminAuthMiddleware } = require("../middleware/admin.middleware");
const equipmentIssueController = require("../controllers/equipmentIssue.controller");

const router = express.Router();

router.post("/member", memberAuthMiddleware, equipmentIssueController.createEquipmentIssue);
router.get("/member", memberAuthMiddleware, equipmentIssueController.getMyEquipmentIssues);

router.get("/admin", adminAuthMiddleware, equipmentIssueController.getAllEquipmentIssues);
router.patch("/admin/:id/status", adminAuthMiddleware, equipmentIssueController.updateEquipmentIssueStatus);

module.exports = router;
