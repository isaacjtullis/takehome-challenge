# Treasury Yield Curve Management System

A full-stack application for managing and visualizing treasury yield curve data.

## Tech Stack

- **Frontend**: React with TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Charts**: Recharts for yield curve visualization
- **State Management**: React Query
- **Backend**: Node.js with Express
- **Database**: SQLite with Prisma ORM
- **Development**: Concurrently for running both frontend/backend

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json with scripts
└── README.md        # This file
```

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up the database && Generate Prisma Client:**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Database Setup

### Prisma Commands

**Generate Prisma Client:**
```bash
cd server
npx prisma generate
```

**Run Migrations:**
```bash
cd server
npx prisma migrate dev
```

**Reset Database (drops all data):**
```bash
cd server
npx prisma migrate reset
```

**View Database in Prisma Studio:**
```bash
cd server
npx prisma studio
```

### Database Schema

We are using SQLite in this take home challenge. These are the models we created:
- **Order**: Stores treasury orders with term, amount, rate, and customer relationship
- **YieldCurve**: TODO: Stores cached yield curve data (not used in simplified version) 

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server

## API Endpoints

- `GET /api/yield-data` - Get current treasury yield curve data
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order

## Development

The application uses a monorepo structure with:
- **Frontend** running on port 5173 (Vite default)
- **Backend** running on port 3000
- **SQLite database** stored in `server/prisma/dev.db` 