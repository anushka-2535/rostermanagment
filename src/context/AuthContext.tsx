import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

export const DEMO_ACCOUNTS: Record<UserRole, AuthUser & { passwordHint: string; description: string }> = {
  ADMIN: {
    id: 'user-admin-01',
    email: 'admin@rosterflow.com',
    name: 'Anushka Jadhav',
    role: 'ADMIN',
    avatarInitials: 'AJ',
    passwordHint: 'admin123',
    description: 'Operations Manager — Full global access across all pods and brands',
  },
  POD_LEAD: {
    id: 'user-lead-01',
    email: 'priya.sharma@rosterflow.com',
    name: 'Priya Sharma',
    role: 'POD_LEAD',
    podId: 'pod-alpha',
    employeeId: 'emp-001',
    avatarInitials: 'PS',
    passwordHint: 'lead123',
    description: 'Pod Alpha Lead — Scoped strictly to Pod Alpha (FinTech Core)',
  },
  EMPLOYEE: {
    id: 'user-emp-01',
    email: 'rahul.verma@rosterflow.com',
    name: 'Rahul Verma',
    role: 'EMPLOYEE',
    podId: 'pod-alpha',
    employeeId: 'emp-002',
    avatarInitials: 'RV',
    passwordHint: 'emp123',
    description: 'Senior Specialist (Pod Alpha) — Personal schedule and leave portal only',
  },
};

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('rf_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rf_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rf_auth_user');
    }
  }, [currentUser]);

  const login = async (email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check against demo accounts
    const matchedRole = (Object.keys(DEMO_ACCOUNTS) as UserRole[]).find(
      (role) => DEMO_ACCOUNTS[role].email.toLowerCase() === normalizedEmail
    );

    if (matchedRole) {
      const account = DEMO_ACCOUNTS[matchedRole];
      setCurrentUser({
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        podId: account.podId,
        employeeId: account.employeeId,
        avatarInitials: account.avatarInitials,
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email address. Please use one of the demo credentials below.',
    };
  };

  const loginAsDemo = (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    setCurrentUser({
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      podId: account.podId,
      employeeId: account.employeeId,
      avatarInitials: account.avatarInitials,
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
