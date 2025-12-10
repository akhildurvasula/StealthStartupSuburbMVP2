import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { authMiddleware } from '../utils/auth';

const router = Router();

/**
 * GET /api/events
 * List all events with optional filters
 */
router.get('/', eventController.getEvents);

/**
 * GET /api/events/:id
 * Get single event details
 */
router.get('/:id', eventController.getEventById);

/**
 * POST /api/events
 * Create a new event (requires authentication)
 */
router.post('/', authMiddleware, eventController.createEvent);

/**
 * PATCH /api/events/:id
 * Update an event (requires authentication and ownership)
 */
router.patch('/:id', authMiddleware, eventController.updateEvent);

/**
 * DELETE /api/events/:id
 * Delete an event (requires authentication and ownership)
 */
router.delete('/:id', authMiddleware, eventController.deleteEvent);

/**
 * POST /api/events/:id/attend
 * Join an event
 */
router.post('/:id/attend', authMiddleware, eventController.attendEvent);

/**
 * POST /api/events/:id/leave
 * Leave an event
 */
router.post('/:id/leave', authMiddleware, eventController.leaveEvent);

export default router;

