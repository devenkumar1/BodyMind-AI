import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Training from './pages/Training';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import MealGenerator from './pages/MealGenerator';
import WorkoutGenerator from './pages/WorkoutGenerator';
import Subscription from './pages/Subscription';
import { useAuth } from './context/AuthContext';
import Assistant from './pages/Assistant';
import AiRecipe from './pages/AiRecipe';
import TrainerBooking from './pages/TrainerBooking';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import VideoMeeting from './pages/VideoMeeting';
import { Input } from '@/components/ui/Input';

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Homepage route - redirects based on authentication status */}
          <Route path="/" element={
            isAuthenticated ? <Home /> : <LandingPage />
          } />

          {/* Public routes - redirect if already authenticated */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Register />
          } />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/training" element={<Training />} />
            <Route path="/meal-generator" element={<MealGenerator />} />
            <Route path="/workout-generator" element={<WorkoutGenerator />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/meal-plan" element={<Navigate to="/meal-generator" />} />
            <Route path="/ai-assistant" element={<Assistant/>} />
            <Route path="/ai-recipe" element={<AiRecipe/>} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/video-meeting/:roomId" element={<VideoMeeting />} />
            
            {/* Role-specific routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          </Route>

          <Route path="/booking" element={<TrainerBooking />} />

          {/* Fallback route */}
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}