
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

interface WIPProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const WIP: React.FC<WIPProps> = ({ theme, onToggleTheme }) => {
  return (
    <Layout 
      theme={theme} 
      onToggleTheme={onToggleTheme}
      title="🚧 Work in Progress 🚧"
      subtitle="This page is currently under development. Please check back soon!"
    >
      <div className="flex flex-col items-center justify-center text-center p-10 animate-fade-slide">
        <div className={`w-full max-w-md p-10 rounded-2xl border backdrop-blur-md shadow-2xl transition-all
          ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white border-black/10 shadow-lg text-gray-800'}`}>
          <i className="fas fa-tools text-6xl mb-6 text-yellow-500"></i>
          <h2 className="text-2xl font-semibold mb-3">We're Working on It!</h2>
          <p className="opacity-70">We are preparing this section for you. Stay tuned for updates.</p>
        </div>
        
        <div className="mt-12">
          <Link to="/" className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 shadow-md
            ${theme === 'dark' ? 'bg-cyan-500 text-slate-900' : 'bg-cyan-600 text-white'}`}>
            <i className="fas fa-home"></i> Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default WIP;
