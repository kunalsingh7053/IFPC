const express = require("express");
const userController = require("../controllers/member.auth.controller");
const upload = require("../middleware/upload.middleware");
const { memberAuthMiddleware } = require("../middleware/member.middleware");
const { adminAuthMiddleware } = require("../middleware/admin.middleware");
const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  userController.register
);
router.post("/login", userController.loginMember);
router.get("/public-members", userController.getPublicMembers);
router.get("/members", adminAuthMiddleware, userController.getMembers);
router.get("/profile", memberAuthMiddleware, userController.getProfile);
router.post("/logout", memberAuthMiddleware, userController.logoutMember);
router.patch(
  "/profile",
  memberAuthMiddleware,
  upload.single("profileImage"),
  userController.updateProfile
);
module.exports = router;