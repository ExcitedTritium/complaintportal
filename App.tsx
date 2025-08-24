import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import FacultyLoginPage from './pages/FacultyLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import FacultyDashboardPage from './pages/FacultyDashboardPage';
import StarryBackground from './components/StarryBackground';
import ThemeToggle from './components/ThemeToggle';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      // Default to dark theme if no theme is stored or if the value is invalid
      return (storedTheme === 'light') ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navigateTo = (page: Page) => {
    if (page === Page.Home) {
        setIsStudentLoggedIn(false);
        setIsFacultyLoggedIn(false);
    }
    setCurrentPage(page);
  };

  const handleStudentLoginSuccess = () => {
    setIsStudentLoggedIn(true);
    setCurrentPage(Page.StudentDashboard);
  };
  
  const handleFacultyLoginSuccess = () => {
    setIsFacultyLoggedIn(true);
    setCurrentPage(Page.FacultyDashboard);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.StudentLogin:
        return <StudentLoginPage onNavigate={navigateTo} onLoginSuccess={handleStudentLoginSuccess} />;
      case Page.StudentDashboard:
        if (isStudentLoggedIn) {
            return <StudentDashboardPage onNavigate={navigateTo} />;
        }
        // Redirect to login if not authenticated
        return <StudentLoginPage onNavigate={navigateTo} onLoginSuccess={handleStudentLoginSuccess} />;
      case Page.FacultyLogin:
        return <FacultyLoginPage onNavigate={navigateTo} onLoginSuccess={handleFacultyLoginSuccess} />;
      case Page.FacultyDashboard:
        if (isFacultyLoggedIn) {
            return <FacultyDashboardPage onNavigate={navigateTo} />;
        }
         // Redirect to login if not authenticated
        return <FacultyLoginPage onNavigate={navigateTo} onLoginSuccess={handleFacultyLoginSuccess} />;
      case Page.Home:
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <main className="min-h-screen text-text-light-mode dark:text-text-dark font-sans">
      <StarryBackground />
      <div className="fixed top-0 left-0 w-full h-full bg-nebula -z-10"></div>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <div className="relative z-10 p-5 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {renderPage()}
      </div>
    </main>
  );
};

export default App;