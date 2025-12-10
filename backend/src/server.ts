import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import suburbRoutes from './routes/suburbs';
import eventRoutes from './routes/events';
import hoaRoutes from './routes/hoa-locations';
import artistRoutes from './routes/artist-discovery';
import homeLocationRoutes from './routes/home-locations';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/suburbs', suburbRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/hoa-locations', hoaRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/home-location', homeLocationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /api/auth/signup`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/suburbs`);
  console.log(`  GET    /api/suburbs/:id`);
  console.log(`  POST   /api/events`);
  console.log(`  GET    /api/events`);
  console.log(`  GET    /api/events/:id`);
  console.log(`  PATCH  /api/events/:id`);
  console.log(`  DELETE /api/events/:id`);
  console.log(`  POST   /api/hoa-locations`);
  console.log(`  GET    /api/hoa-locations`);
  console.log(`  GET    /api/artist/discovery`);
  console.log(`  POST   /api/home-location`);
  console.log(`  GET    /api/home-location/:userId`);
});

export default app;

