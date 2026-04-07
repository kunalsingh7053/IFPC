const express = require('express');
const { adminAuthMiddleware } = require('../middleware/admin.middleware');
const authController = require('../controllers/auth.controller');
const validators = require('../middleware/validator.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();


router.post('/register',validators.validateRegister, authController.registerAdmin)
router.post('/login', validators.validateLogin, authController.loginAdmin) 
router.get('/member-registration-status', authController.getMemberRegistrationStatus)
router.get('/profile', adminAuthMiddleware, authController.getAdminProfile)
router.get('/dashboard-stats', adminAuthMiddleware, authController.getAdminDashboardStats)
router.patch('/member-registration-status', adminAuthMiddleware, authController.updateMemberRegistrationStatus)
router.patch(
  "/profile",
  adminAuthMiddleware,
  upload.single("profileImage"), 
  authController.updateAdminProfile
);
router.post('/logout', adminAuthMiddleware, authController.logoutAdmin)
module.exports = router;