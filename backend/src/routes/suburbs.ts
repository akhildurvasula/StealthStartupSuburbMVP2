import { Router } from 'express';
import * as suburbController from '../controllers/suburbController';

const router = Router();

/**
 * GET /api/suburbs
 * Get all suburbs with scores
 */
router.get('/', suburbController.getAllSuburbs);

/**
 * GET /api/suburbs/:id
 * Get single suburb with intelligence layer
 */
router.get('/:id', suburbController.getSuburbById);

/**
 * POST /api/suburbs (Admin only - for seeding/management)
 * Create a new suburb
 */
router.post('/', suburbController.createSuburb);

export default router;

