# Freaky Fit - Fitness App

A modern fitness application built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript.

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- TailwindCSS
- Shadcn UI
- Zod for validation
- React Router
- Axios

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Zod for validation
- Express Validator

## Project Structure

```
freaky-fit/
├── frontend/          # React frontend application
└── backend/           # Node.js backend application
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the variables with your values

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

## Features
- User authentication (Login/Signup)
- Modern and responsive UI
- Type-safe development with TypeScript
- Form validation with Zod
- Secure API endpoints
- MongoDB database integration 