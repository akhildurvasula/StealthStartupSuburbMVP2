import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// ===== MIDDLEWARE =====

// CORS - Allow all origins for Alpha
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== ROUTES =====

app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Suburban Culture Engine API v3.0 Alpha',
    mission: 'Building community in places where community has collapsed',
    endpoints: {
      health: '/api/health',
      suburbInfo: '/api/suburb-info',
      events: '/api/events',
      interestSignals: '/api/interest-signals',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== START SERVER =====

app.listen(PORT, () => {
  console.log('');
  console.log('🌱 =====================================');
  console.log('🏡 Suburban Culture Engine V3 Alpha');
  console.log('🚀 Building community, one micro-event at a time');
  console.log('=====================================');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ API endpoints: http://localhost:${PORT}/api`);
  console.log('');
  console.log('📋 Available routes:');
  console.log('   POST   /api/auth/signup');
  console.log('   POST   /api/auth/login');
  console.log('   GET    /api/suburb-info');
  console.log('   POST   /api/events');
  console.log('   GET    /api/events');
  console.log('   GET    /api/events/:id');
  console.log('   POST   /api/events/:id/attend');
  console.log('   POST   /api/events/:id/leave');
  console.log('   POST   /api/interest-signals');
  console.log('   GET    /api/interest-signals');
  console.log('   POST   /api/interest-signals/:id/interest');
  console.log('');
});

export default app;

