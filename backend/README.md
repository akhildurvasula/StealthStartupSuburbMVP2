# Suburb Events Backend

Node.js + Express backend for the Suburb Events MVP, using Supabase as the database.

## Quick Start

1. **Setup Supabase** (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**:
   - Copy `.env` and fill in your Supabase credentials
4. **Run the server**:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **ORM**: @supabase/supabase-js
- **Auth**: JWT + bcrypt

## Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, validation, etc.
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   └── server.ts         # Entry point
├── scripts/
│   ├── setup-tables.sql  # Database schema
│   └── seed.ts           # Sample data
├── .env                  # Environment variables
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run seed` - Seed database with sample data
- `npm run setup` - Run database setup (use SQL Editor instead)

## Environment Variables

Required in `.env`:

```env
SUPABASE_URL=           # Your Supabase project URL
SUPABASE_ANON_KEY=      # Public anon key
SUPABASE_SERVICE_ROLE_KEY= # Service role key (keep secret!)
PORT=4000
NODE_ENV=development
JWT_SECRET=             # Secret for signing JWTs
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/magic-link` - Request magic link (MVP)

### Suburbs
- `GET /api/suburbs` - List all suburbs with scores
- `GET /api/suburbs/:id` - Get suburb details
- `POST /api/suburbs` - Create suburb (admin)

### Events
- `GET /api/events` - List events (with filters)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/attend` - Join event
- `POST /api/events/:id/leave` - Leave event

### HOA Locations
- `GET /api/hoa-locations` - List HOA locations
- `GET /api/hoa-locations/:id` - Get location details
- `POST /api/hoa-locations` - Create location (HOA admin)
- `PATCH /api/hoa-locations/:id` - Update location
- `DELETE /api/hoa-locations/:id` - Delete location

### Artist Discovery
- `GET /api/artist/discovery` - Get heatmap data

### Home Locations
- `POST /api/home-location` - Set home location
- `GET /api/home-location/:userId` - Get user's home
- `PATCH /api/home-location` - Update visibility
- `DELETE /api/home-location` - Remove home location

## Authentication

The API uses JWT tokens. Include in requests:

```
Authorization: Bearer <your-token>
```

Get a token by calling `/api/auth/signup` or `/api/auth/login`.

## Development

The server uses `tsx watch` for hot reloading. Any changes to `.ts` files will automatically restart the server.

## Production

1. Build the app:
   ```bash
   npm run build
   ```
2. Set environment variables on your hosting platform
3. Run:
   ```bash
   npm start
   ```

## Troubleshooting

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for common issues and solutions.
