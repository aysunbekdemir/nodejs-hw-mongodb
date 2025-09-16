const express = require('express');
const ctrlWrapper = require('../utils/ctrlWrapper');
const authController = require('../controllers/auth');
const validateBody = require('../middlewares/validateBody');
const { registerSchema, loginSchema } = require('../db/models/User');

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.registerUser);
router.post('/login', validateBody(loginSchema), authController.loginUser);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);
router.post('/send-reset-email', validateBody, ctrlWrapper(authController.sendResetEmail));

module.exports = router;