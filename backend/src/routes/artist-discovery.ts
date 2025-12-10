import { Router } from 'express';
import * as artistController from '../controllers/artistController';

const router = Router();

/**
 * GET /api/artist/discovery
 * Get artist discovery heatmap data
 * Returns suburbs ranked by artist opportunity
 */
router.get('/discovery', artistController.getArtistDiscovery);

export default router;

