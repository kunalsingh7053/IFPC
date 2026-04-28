const express = require("express");
const { adminAuthMiddleware } = require("../middleware/admin.middleware");
const fundsController = require("../controllers/funds.controller");

const router = express.Router();

// Public routes (both admin and member can view)
router.get("/", fundsController.getAllFunds);
router.get("/summary", fundsController.getFundsSummary);
router.get("/invoice/download", fundsController.generateInvoice);

// Admin-only routes
router.post("/", adminAuthMiddleware, fundsController.createFund);
router.patch("/:id", adminAuthMiddleware, fundsController.updateFund);
router.delete("/:id", adminAuthMiddleware, fundsController.deleteFund);

module.exports = router;
