const express = require('express');
const { adminAuthMiddleware } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');
const validators = require('../middleware/validator.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();


router.post('/register',validators.validateRegister, authController.registerAdmin)
router.post('/login', validators.validateLogin, authController.loginAdmin) 
router.get('/profile', adminAuthMiddleware, authController.getAdminProfile)
router.patch(
  "/profile",
  adminAuthMiddleware,
  upload.single("profileImage"), 
  authController.updateAdminProfile
);
module.exports = router;