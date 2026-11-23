import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RosterProvider, useRoster } from './context/RosterContext';
import { LoginPage } from './components/auth/LoginPage';
import { HomePage } from './components/home/HomePage';
import { MainLayout } from './components/layout/MainLayout';
import { ThemeProvider } from './context/ThemeContext';
import { UserRole } from './types';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { setActiveTab } = useRoster();
  const [showLogin, setShowLogin] = useState(false);
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      setShowLogin(false);
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'POD_LEAD') {
      setActiveTab('lead_dashboard');
    } else if (role === 'EMPLOYEE') {
      setActiveTab('employee_schedule');
    } else {
      setActiveTab('dashboard');
    }
  };

  if (!isAuthenticated || !currentUser) {
    return showLogin ? (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setShowLogin(false)}
      />
    ) : (
      <HomePage onSignIn={() => setShowLogin(true)} />
    );
  }

  return <MainLayout />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RosterProvider>
          <AuthenticatedApp />
        </RosterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
