import { Router } from 'express';
import {
  register,
  login,
  logout,
  refresh,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema, // Bu şemayı validation dosyanıza eklemeniz gerekebilir
  refreshSessionSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/register', validateBody(registerUserSchema), register);
router.post('/login', validateBody(loginUserSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', validateBody(refreshSessionSchema), refresh);
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmail,
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPassword,
);

export default router;