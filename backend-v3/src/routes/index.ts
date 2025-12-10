import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { getSuburbInfo } from '../controllers/suburbController';
import { 
  createEvent, 
  getEvents, 
  getEventById, 
  attendEvent, 
  leaveEvent 
} from '../controllers/eventsController';
import {
  createInterestSignal,
  getInterestSignals,
  expressInterest,
} from '../controllers/interestSignalsController';
import { optionalAuthMiddleware, authMiddleware } from '../utils/auth';

const router = Router();

// ===== AUTH ROUTES =====
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// ===== SUBURB INFO =====
router.get('/suburb-info', getSuburbInfo);

// ===== EVENTS =====
router.post('/events', createEvent);
router.get('/events', optionalAuthMiddleware, getEvents);
router.get('/events/:id', optionalAuthMiddleware, getEventById);
router.post('/events/:id/attend', attendEvent);
router.post('/events/:id/leave', leaveEvent);

// ===== INTEREST SIGNALS (Ghost Pins) =====
router.post('/interest-signals', createInterestSignal);
router.get('/interest-signals', getInterestSignals);
router.post('/interest-signals/:id/interest', expressInterest);

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '3.0.0-alpha' });
});

export default router;

