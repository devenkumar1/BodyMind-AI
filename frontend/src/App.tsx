import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import AppRoutes from './routes';
import { ThemeProvider } from './components/theme-provider';
import { PWAStatus } from './components/PWAStatus';
import { InstallPrompt } from './components/InstallPrompt';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="bodymind-ai-theme">
        <NetworkProvider>
          <AuthProvider>
            <AppRoutes />
            <PWAStatus />
            <InstallPrompt />
          </AuthProvider>
        </NetworkProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
