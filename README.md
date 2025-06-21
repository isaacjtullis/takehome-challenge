# Treasury Yield Curve Management System

A full-stack application for managing and visualizing treasury yield curve data.

## Tech Stack

- **Frontend**: React with TypeScript, Vite, shadcn/ui, Tailwind CSS
- **Charts**: Recharts for yield curve visualization
- **State Management**: React Query
- **Backend**: Node.js with Express
- **Database**: SQLite with Prisma ORM
- **Development**: Concurrently for running both frontend/backend

## Thought Process & Future Improvements
- Overall, I'm happy with the general structure and feel of the application. A clean, mobile friendly application that utalizes Shadcn/ui to make the designs come to life (animation, toast messages, loading icons). The backend is powered by a simple Express + SQLite setup to make onboarding easy and migrations painless.

## If "I had more time" list:
- Caching for treasury data (a quick win would be to save the data in the db and we could do a look up vs calling the public api to get this data.) This would immediately speed up the data on hard refresh and limit api calls. We are using react-query to cache data on the FE but this doesn't persist on hard refresh. 
- Limited test coverage. I would bump up test coverage for the FE and BE.
- Add authentication. Right now, anyone can post orders. Adding auth would let us track who’s doing what.
- API calls. I'm utalizing a free API given by the U.S. Department of the Treasury. I went with this as it was free and open to the public (did not require an API key). But I'd explore more reliable or commercial data sources for production use.
- Harden the backend. Our error handling is pretty limited. This coudld be expanded to look for edge cases, retries, and improve logging.

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
If you haven't already, you will be prompted to install Prisma at this step, choose Y.
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Start development servers:**
From the root repository run:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

5. **To Run Tests**
   ```bash
   cd client
   npm test
   ```

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

## Dev Scripts

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