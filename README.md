# Auction Bay

Auction Bay is a full-stack web application used for creating, browsing, and bidding on time-based online auctions.

## Tech Stack

- Frontend: React(Vite), Tailwind CSS
- Frontend Validation: react-hook-form, zod
- Backend: NestJS
- Database: Prisma
- Authentication: JWT
- File uploads: Multer

## Features

- User registration and login
- User profile management
- User avatar upload/change
- Browsing all active auctions
- View auction details and bid history
- Bidding on auctions
- Create auctions
- Edit and delete auctions
- Automatic auction start
- Automatic auction end

## Project Structure

- frontend/ # React frontend application
- backend/ # NestJS backend API

## Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL
- npm (or yarn / pnpm)

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the `backend` directory with the following variables:

- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`
- `JWT_SECRET=your_jwt_secret`
- `CORS_ORIGIN=http://localhost:5173`

### Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend` directory with the following variables:

- `VITE_API_URL=http://localhost:3000`

## Run Locally

### 1) Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend server in dev mode:

```bash
npm run start:dev
```

### 2) Frontend

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at: http://localhost:5173.

## Links

- Git repository: https://github.com/USERNAME/REPO_NAME
- Trello board: (to be added)
- Deployed application: (to be added)
