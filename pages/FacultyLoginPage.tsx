
import React from 'react';
import { Page } from '../types';
import LoginCard from '../components/LoginCard';

interface FacultyLoginPageProps {
  onNavigate: (page: Page) => void;
  onLoginSuccess: () => void;
}

const FacultyLoginPage: React.FC<FacultyLoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would perform authentication here.
    // For this demo, we'll just simulate a successful login.
    onLoginSuccess();
  };

  return (
    <LoginCard
      title="Faculty & Staff Login"
      icon={<span>🧑‍🏫</span>}
      footer={
        <p className="text-center mt-6 text-sm">
          <button onClick={() => onNavigate(Page.Home)} className="font-medium text-primary hover:underline">
            &larr; Back to Portal Selection
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="faculty-id" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">
            Faculty ID or Email
          </label>
          <input
            type="text"
            id="faculty-id"
            name="faculty-id"
            required
            defaultValue="faculty@school.edu"
            placeholder="e.g., prof.name@school.edu"
            className="w-full px-4 py-3 bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="faculty-password" className="block text-sm font-medium text-text-light-mode dark:text-text-light-dark mb-2">
            Password
          </label>
          <input
            type="password"
            id="faculty-password"
            name="faculty-password"
            required
            defaultValue="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white/5 dark:bg-black/20 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
         <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
         </div>
        <button
          type="submit"
          className="w-full py-3 px-4 font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-glow-button"
        >
          Sign In
        </button>
      </form>
    </LoginCard>
  );
};

export default FacultyLoginPage;