import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          // Set the token in localStorage
          localStorage.setItem('token', token);
          
          // Set token in axios headers immediately
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            // Fetch user data from the API
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/status`);
            
            if (response.data.isAuthenticated && response.data.user) {
              // Store user data
              const user = response.data.user;
              localStorage.setItem('user', JSON.stringify(user));
              
              // Update auth state in context
              setAuthState(true, user);
              
              // Role-based redirection
              if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
              } else if (user.role === 'TRAINER') {
                navigate('/trainer/dashboard');
              } else {
                navigate('/home');
              }
            } else {
              // Authentication failed
              setError('Authentication failed');
              setAuthState(false, null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setTimeout(() => navigate('/login'), 2000);
            }
          } catch (apiError) {
            console.error('Error fetching user data:', apiError);
            setError('Error fetching user data');
            setAuthState(false, null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTimeout(() => navigate('/login'), 2000);
          }
        } else {
          console.error('No token received');
          setError('No authentication token received');
          setAuthState(false, null);
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setError('Authentication error occurred');
        setAuthState(false, null);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate, setAuthState]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        {error ? (
          <div>
            <h2 className="mb-2 text-2xl font-semibold text-red-500">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        ) : (
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Completing login...</h2>
            <p className="text-muted-foreground">Please wait while we authenticate you.</p>
          </div>
        )}
      </div>
    </div>
  );
}