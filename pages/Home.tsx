
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

interface HomeProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, onToggleTheme }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const departments = [
    { name: 'English', id: 'english', icon: 'fa-feather-alt', color: '#14b8a6' },
    { name: 'Physics', id: 'physics', icon: 'fa-atom', color: '#8b5cf6' },
    { name: 'Electronics', id: 'electronics', icon: 'fa-microchip', color: '#f59e0b' },
    { name: 'Development Economics', id: 'development economics', icon: 'fa-chart-line', color: '#10b981' },
    { name: 'Commerce', id: 'commerce', icon: 'fa-wallet', color: '#3b82f6' }
  ];

  const brandGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]' 
    : 'bg-gradient-to-r from-[#0284c7] to-[#4f46e5]';

  return (
    <Layout theme={theme} onToggleTheme={onToggleTheme}>
      {/* Search Section - High Clarity */}
      <div className="w-full max-w-2xl mx-auto my-12 animate-fade-in">
        <div className={`p-1.5 rounded-[24px] shadow-2xl border transition-all duration-300
          ${theme === 'dark' ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <form onSubmit={handleSearch} className="flex flex-row items-center gap-2">
            <div className="pl-6 text-slate-400">
              <i className="fas fa-search text-lg"></i>
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by subject or course name..." 
              className={`flex-grow bg-transparent border-none outline-none py-4 text-lg font-medium
                ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
            <button 
              type="submit" 
              className={`px-8 py-3.5 rounded-[18px] font-bold text-white transition-all hover:brightness-110 active:scale-95 mr-1 ${brandGradient}`}
            >
              SEARCH
            </button>
          </form>
        </div>
        <p className={`mt-4 text-center text-xs font-bold uppercase tracking-[0.2em] opacity-50 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Quickly find verified study materials
        </p>
      </div>

      {/* Department Grid - Redesigned for Legibility */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h3 className={`text-center text-sm font-black uppercase tracking-[0.3em] mb-10 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}>
          Browse by Department
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 animate-fade-slide">
          {departments.map((dept, index) => (
            <Link 
              key={index} 
              to={`/department/${dept.id}`}
              className={`group relative flex flex-col items-center p-8 rounded-[32px] transition-all duration-500 hover:-translate-y-3
                ${theme === 'dark' 
                  ? 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600 shadow-xl' 
                  : 'bg-white border border-slate-200 hover:shadow-2xl'
                }`}
            >
              <div 
                className="w-20 h-20 mb-6 rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
              >
                <i className={`fas ${dept.icon} text-3xl`}></i>
              </div>
              <h2 className={`text-sm font-black uppercase text-center tracking-widest leading-relaxed transition-colors
                ${theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>
                {dept.name}
              </h2>
              
              <div 
                className="absolute bottom-6 h-1 w-0 group-hover:w-12 rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: dept.color }}
              ></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Contribution Portal Section */}
      <div className="mt-16 mb-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className={`inline-block p-1 rounded-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <Link 
            to="/upload" 
            className={`flex items-center gap-4 px-12 py-5 rounded-full font-black text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] text-white ${brandGradient}`}
          >
            <i className="fas fa-plus-circle"></i>
            CONTRIBUTE 
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <i className="fas fa-check-circle text-sky-500"></i> Manual Review
          </span>
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <i className="fas fa-shield-alt text-sky-500"></i> Verified Source
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
