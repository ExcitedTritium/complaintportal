
import React from 'react';

interface LoginCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const LoginCard: React.FC<LoginCardProps> = ({ title, icon, children, footer }) => {
  return (
    <div className="w-full max-w-md animate-popIn">
      <div className="relative bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-glow-light dark:shadow-glow-dark p-8 backdrop-blur-lg transition-all duration-300">
        <div className="absolute inset-0 border rounded-2xl pointer-events-none -m-px bg-gradient-to-r from-primary via-secondary to-accent opacity-15"></div>
        <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 text-primary text-4xl">
              {icon}
            </div>
          <h1 className="font-display text-3xl font-bold text-text-light-mode dark:text-text-dark">{title}</h1>
        </div>
        {children}
      </div>
       {footer}
    </div>
  );
};

export default LoginCard;
