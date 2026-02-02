
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  title?: string;
  subtitle?: string;
  showToggle?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  theme, 
  onToggleTheme, 
  title = "GCM Question Bank", 
  subtitle = "Access previous-year question papers of Kannur University by subject code or department.",
  showToggle = true 
}) => {
  const year = new Date().getFullYear();

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-all duration-500 animate-bg-shift relative
      ${theme === 'dark' 
        ? 'bg-gradient-to-br from-[#1b2735] to-[#090a0f] text-white' 
        : 'bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] text-gray-900'
      }`}>
      
      {/* Theme Toggle - Fixed at the highest stacking level to prevent jitter or collisions */}
      {showToggle && (
        <button 
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className={`fixed top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 z-[999] shadow-lg backdrop-blur-md
            ${theme === 'dark' 
              ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white' 
              : 'bg-white/80 border-black/10 hover:bg-gray-100 text-gray-800'
            }`}
        >
          <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      )}

      {/* Increased top padding (pt-20/24) ensures no overlap with the fixed theme toggle button */}
      <header className="text-center pt-20 sm:pt-24 pb-5 px-5 z-10 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-wide mb-2">{title}</h1>
        <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto">{subtitle}</p>
      </header>

      <main className="flex-grow z-10 px-5 flex flex-col items-center">
        {children}
      </main>

      <footer className={`mt-12 text-center py-6 px-5 text-sm opacity-85 z-10 transition-colors duration-300 backdrop-blur-md
        ${theme === 'dark' ? 'bg-white/5 border-t border-white/10' : 'bg-black/5 border-t border-black/10'}`}>
        <p>© {year} GCM Question Bank | Built for Students, by Students</p>
      </footer>
    </div>
  );
};

export default Layout;
