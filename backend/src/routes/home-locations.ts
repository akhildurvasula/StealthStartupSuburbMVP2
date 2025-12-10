import { Router } from 'express';
import * as homeLocationController from '../controllers/homeLocationController';
import { authMiddleware } from '../utils/auth';

const router = Router();

/**
 * POST /api/home-location
 * Set user's home location
 */
router.post('/', authMiddleware, homeLocationController.setHomeLocation);

/**
 * GET /api/home-location/:userId
 * Get user's home location
 */
router.get('/:userId', homeLocationController.getHomeLocation);

/**
 * PATCH /api/home-location
 * Update home location visibility
 */
router.patch('/', authMiddleware, homeLocationController.updateHomeLocation);

/**
 * DELETE /api/home-location
 * Delete home location
 */
router.delete('/', authMiddleware, homeLocationController.deleteHomeLocation);

export default router;

