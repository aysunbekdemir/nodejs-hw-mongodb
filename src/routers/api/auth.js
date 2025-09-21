import express from 'express';
import {
  registerUserSchema,
  loginUserSchema,
  sendResetEmailSchema,
} from '../../schemas/users.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  sendResetEmail,
  resetPassword,
} from '../../controllers/users.js'; // users.js'i kullan
import validateBody from '../../middlewares/validateBody.js';
import authenticate from '../../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', validateBody(loginUserSchema), loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/current', authenticate, getCurrentUser);
router.post(
  '/reset-password-email',
  validateBody(sendResetEmailSchema),
  sendResetEmail
);
router.post('/reset-password-new', resetPassword);

export default router;
