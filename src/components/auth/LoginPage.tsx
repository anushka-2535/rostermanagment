import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Boxes,
  User,
  Shield,
  Sparkles,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('admin@rosterflow.com');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (email.includes('lead')) {
        onLoginSuccess('POD_LEAD');
      } else if (email.includes('verma') || email.includes('emp')) {
        onLoginSuccess('EMPLOYEE');
      } else {
        onLoginSuccess('ADMIN');
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please use a demo account below.');
    }
  };

  const handleDemoQuickLogin = (role: UserRole) => {
    loginAsDemo(role);
    onLoginSuccess(role);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Centered Container */}
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
          <ThemeToggle />
        </div>

        {/* Brand & Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/25">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">RosterFlow</h1>
          <p className="text-xs text-slate-500">Smart Workforce & Roster Management System</p>
        </div>

        {/* Main Sign-In Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your email and password to access your workspace</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Stacked Vertically */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@rosterflow.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or sign in with demo role
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Demo Accounts Stacked Vertically One Below The Other */}
          <div className="space-y-2.5">
            {/* 1. Admin */}
            <button
              type="button"
              onClick={() => handleDemoQuickLogin('ADMIN')}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-2">
                    Admin / Operations Manager
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                      Full Access
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {DEMO_ACCOUNTS.ADMIN.email}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            {/* 2. Pod Lead */}
            <button
              type="button"
              onClick={() => handleDemoQuickLogin('POD_LEAD')}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Boxes className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-2">
                    Pod Lead (Priya Sharma)
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Pod Alpha
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {DEMO_ACCOUNTS.POD_LEAD.email}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </button>

            {/* 3. Employee */}
            <button
              type="button"
              onClick={() => handleDemoQuickLogin('EMPLOYEE')}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-2">
                    Employee (Rahul Verma)
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                      Personal Portal
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {DEMO_ACCOUNTS.EMPLOYEE.email}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          RosterFlow &bull; Workforce Operations System
        </div>
      </div>
    </div>
  );
};
