import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Freaky Fit</h1>
          <nav>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Welcome, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Ultimate Fitness Journey Starts Here
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Track your workouts, monitor your progress, and reach your fitness goals with Freaky
                Fit - the all-in-one fitness companion designed for all fitness levels.
              </p>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button size="lg" className="mr-4">
                    Get Started
                  </Button>
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/dashboard">
                  <Button size="lg" className="mr-4">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Fitness Workout"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Workout Tracking</h3>
              <p className="text-gray-600">
                Log and track your workouts with detailed exercise information and progress charts.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Custom Routines</h3>
              <p className="text-gray-600">
                Create personalized workout routines tailored to your fitness goals and preferences.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-gray-600">
                Visualize your fitness journey with comprehensive analytics and progress reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Freaky Fit</h2>
              <p className="text-gray-400">Your fitness journey partner</p>
            </div>
            <div>
              <p className="text-gray-400">&copy; {new Date().getFullYear()} Freaky Fit. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 