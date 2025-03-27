import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="freaky-fit-theme">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
