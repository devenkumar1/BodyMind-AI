import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import AppRoutes from './routes';
import { ThemeProvider } from './components/theme-provider';
import { PWAStatus } from './components/PWAStatus';
import { InstallPrompt } from './components/InstallPrompt';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="bodymind-ai-theme">
        <NetworkProvider>
          <AuthProvider>
            <AppRoutes />
            <PWAStatus />
            <InstallPrompt />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
