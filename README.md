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
- Dark/Light theme support

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Google OAuth integration
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

## Implemented Features

### Authentication
- User registration with email/password
- User login with credentials
- Google OAuth integration
- Protected routes for authenticated users
- Authentication state management

### User Interface
- Responsive navbar with authentication state
- Landing page for non-authenticated users
- Home dashboard for authenticated users
- Footer with site navigation and social links
- Dark/Light theme toggle

### Fitness Features
- User profile management
- Workout generator with customizable options
- Meal plan generator with dietary preferences
- Training page with workout tracking

### Pages
- Landing Page: Introduction for non-authenticated users
- Login/Register: User authentication
- Home: Main dashboard for authenticated users
- Profile: User information and settings
- Training: Workout tracking interface
- Meal Generator: Custom meal plan creation
- Workout Generator: Custom workout routine creation

## In Progress / Future Features
- Activity tracking
- Progress visualization
- Social sharing
- Exercise library
- Nutritional information database
- Mobile app integration 