import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import suburbRouter from './routes/suburb';
import eventsRouter from './routes/events';
import hoaZonesRouter from './routes/hoa-zones';
import artistApplicationsRouter from './routes/artist-applications';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/', suburbRouter);
app.use('/', eventsRouter);
app.use('/', hoaZonesRouter);
app.use('/', artistApplicationsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /suburb-info`);
  console.log(`  POST /events`);
  console.log(`  GET  /events`);
  console.log(`  POST /events/:id/attend`);
  console.log(`  POST /events/:id/leave`);
  console.log(`  POST /hoa-zones`);
  console.log(`  GET  /hoa-zones`);
  console.log(`  POST /artist-applications`);
  console.log(`  GET  /artist-applications`);
});

export default app;

