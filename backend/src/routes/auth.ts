import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/magic-link
 * Request a magic link for passwordless login
 */
router.post('/magic-link', authController.requestMagicLink);

/**
 * GET /api/auth/verify-magic/:token
 * Verify and login with magic link token
 */
router.get('/verify-magic/:token', authController.verifyMagicLink);

export default router;

