import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuthStatus, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          localStorage.setItem('token', token);
          await checkAuthStatus();
          navigate('/home');
        } else {
          console.error('No token received');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, checkAuthStatus]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-semibold">Completing login...</h2>
        <p className="text-muted-foreground">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
} 