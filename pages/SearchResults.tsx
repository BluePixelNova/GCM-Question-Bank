
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface SearchResultsProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ theme, onToggleTheme }) => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const [query, setQuery] = useState(queryParam);
  const navigate = useNavigate();

  // Static list of departments based on bucket folders
  const deptFolders = [
    { name: 'Commerce', id: 'commerce' },
    { name: 'Development Economics', id: 'development economics' },
    { name: 'Electronics', id: 'electronics' },
    { name: 'English', id: 'english' },
    { name: 'Physics', id: 'physics' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const filteredDepts = deptFolders.filter(d => 
    d.name.toLowerCase().includes(queryParam.toLowerCase()) ||
    queryParam.toLowerCase().includes(d.id)
  );

  const brandGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1]' 
    : 'bg-gradient-to-r from-[#0284c7] to-[#4f46e5]';

  return (
    <Layout 
      theme={theme} 
      onToggleTheme={onToggleTheme}
      title="Library Search"
      subtitle="Select a matching department to browse verified papers."
    >
      <div className="w-full max-w-3xl px-4">
        <form onSubmit={handleSearch} className="w-full my-8 animate-fade-in">
          <div className={`flex flex-row items-center gap-2 p-2 rounded-[24px] border transition-all duration-300
            ${theme === 'dark' ? 'bg-[#1e293b] border-slate-700/50' : 'bg-white border-slate-200 shadow-md'}`}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search departments..." 
              className={`flex-grow bg-transparent border-none outline-none px-6 py-3 text-lg
                ${theme === 'dark' ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
            />
            <button type="submit" className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 transition-all hover:scale-105
              ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        <main className="w-full mb-20 animate-fade-slide">
          <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {filteredDepts.length > 0 ? 'Matching Departments' : 'No matches found'}
          </h4>

          {filteredDepts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredDepts.map((dept, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col sm:flex-row justify-between items-center p-6 rounded-[24px] border transition-all duration-300
                    ${theme === 'dark' 
                      ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-sky-500/30' 
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'}`}
                >
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <span className="font-black text-lg block uppercase tracking-tight">📁 {dept.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest opacity-50 block mt-1`}>
                      Bucket: privet-files / {dept.id}
                    </span>
                  </div>
                  <Link 
                    to={`/department/${dept.id}`}
                    className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${brandGradient}`}
                  >
                    BROWSE MATERIALS
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50">
              <i className="fas fa-folder-open text-6xl mb-4 text-sky-500/20"></i>
              <p className="text-lg font-bold">No folders match "{queryParam}"</p>
              <p className="text-sm">Try searching for broad department names like 'Commerce' or 'Physics'.</p>
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <Link 
              to="/"
              className={`px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:-translate-y-1 shadow-2xl text-white ${brandGradient}`}
            >
              <i className="fas fa-home"></i> RETURN TO HOME
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default SearchResults;
