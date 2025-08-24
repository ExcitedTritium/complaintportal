import React from 'react';
import { Page } from '../types';
import AnonymousComplaintForm from '../components/AnonymousComplaintForm';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

interface PortalButtonProps {
    onClick?: () => void;
    href?: string;
    title: string;
    description: string;
    icon: string;
}

const PortalButton: React.FC<PortalButtonProps> = ({ onClick, href, title, description, icon }) => {
    const commonClasses = "w-full text-left p-6 bg-card-light/50 dark:bg-card-dark/50 border border-border-light dark:border-border-dark rounded-xl backdrop-blur-sm transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-glow-primary hover:border-primary/50 group";

    const content = (
        <div className="flex items-center gap-4">
            <div className="text-4xl transition-transform duration-300 group-hover:scale-110">{icon}</div>
            <div>
                <h3 className="font-display text-xl font-bold text-text-light-mode dark:text-text-dark transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary">{title}</h3>
                <p className="text-text-light-light dark:text-text-light-dark">{description}</p>
            </div>
        </div>
    );

    if (href) {
        return <a href={href} className={commonClasses}>{content}</a>;
    }

    return <button onClick={onClick} className={commonClasses}>{content}</button>;
};


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="text-center w-full max-w-2xl px-4 animate-fadeInUp">
      <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Campus Complaint Portal
      </h1>
      <p className="text-lg text-text-light-light dark:text-text-light-dark mb-12 max-w-xl mx-auto">
        Log in to your portal or submit an anonymous complaint below.
      </p>
      <div className="space-y-6 max-w-md mx-auto">
        <PortalButton 
            onClick={() => onNavigate(Page.StudentLogin)}
            title="Student Login"
            description="View your submitted complaints and their status."
            icon="🎓"
        />
        <PortalButton 
            onClick={() => onNavigate(Page.FacultyLogin)}
            title="Faculty & Staff Portal"
            description="Review and address student-submitted issues."
            icon="🧑‍🏫"
        />
      </div>
      
      <div className="my-12 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border-light dark:border-border-dark"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-bg-light dark:bg-bg-dark px-4 text-sm uppercase text-text-light-light dark:text-text-light-dark">
                Or
              </span>
            </div>
          </div>
      </div>

      <div className="max-w-md mx-auto">
        <AnonymousComplaintForm />
      </div>

       <footer className="mt-16 text-sm text-text-light-light dark:text-text-light-dark">
            <p>💙 Made with care • Transparent • Fast • Student-First</p>
       </footer>
    </div>
  );
};

export default HomePage;