import { Router } from 'express';
import * as hoaController from '../controllers/hoaController';
import { authMiddleware } from '../utils/auth';

const router = Router();

/**
 * GET /api/hoa-locations
 * Get HOA locations with optional suburb filter
 */
router.get('/', hoaController.getHOALocations);

/**
 * GET /api/hoa-locations/:id
 * Get single HOA location details
 */
router.get('/:id', hoaController.getHOALocationById);

/**
 * POST /api/hoa-locations
 * Create a new HOA location (requires authentication)
 */
router.post('/', authMiddleware, hoaController.createHOALocation);

/**
 * PATCH /api/hoa-locations/:id
 * Update HOA location (requires authentication and ownership)
 */
router.patch('/:id', authMiddleware, hoaController.updateHOALocation);

/**
 * DELETE /api/hoa-locations/:id
 * Delete HOA location (requires authentication and ownership)
 */
router.delete('/:id', authMiddleware, hoaController.deleteHOALocation);

export default router;

