
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Program } from '../types';

interface SelectLevelProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SelectLevel: React.FC<SelectLevelProps> = ({ theme, onToggleTheme }) => {
  const { dept } = useParams<{ dept: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | ''>('');
  const [semester, setSemester] = useState<string>('');
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);

  useEffect(() => {
    if (program === Program.UG) setAvailableSemesters([1, 2, 3, 4, 5, 6]);
    else if (program === Program.PG) setAvailableSemesters([1, 2, 3, 4]);
    else if (program === Program.FYUGP) setAvailableSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
    else setAvailableSemesters([]);
    setSemester('');
  }, [program]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dept && program && semester) {
      navigate(`/materials/${dept.toLowerCase()}/${program.toLowerCase()}/${semester}/`);
    }
  };

  const brandGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-[#1e88e5] to-[#6c63ff]' 
    : 'bg-gradient-to-r from-[#2196f3] to-[#7b61ff]';

  return (
    <Layout 
      theme={theme} 
      onToggleTheme={onToggleTheme}
      title={`${dept} Department`}
      subtitle="Select your program and semester to access materials"
    >
      <div className={`w-full max-w-md my-10 p-8 rounded-3xl backdrop-blur-xl animate-fade-slide shadow-2xl border
        ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-black/10 text-gray-800'}`}>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="text-left">
            <label className="flex items-center gap-2 font-bold mb-3 uppercase tracking-widest text-xs opacity-60">
              <i className="fas fa-graduation-cap text-[#00bcd4]"></i> Academic Program
            </label>
            <div className="relative">
              <select 
                value={program}
                onChange={(e) => setProgram(e.target.value as Program)}
                required
                className={`w-full p-4 rounded-xl outline-none appearance-none transition-all duration-300 border
                  ${theme === 'dark' 
                    ? 'bg-black/20 border-white/10 text-white focus:border-[#00bcd4]' 
                    : 'bg-gray-100 border-black/10 text-gray-900 focus:border-[#2196f3]'}`}
              >
                <option value="">Choose program</option>
                <option value={Program.UG}>UG (Undergraduate)</option>
                <option value={Program.PG}>PG (Postgraduate)</option>
                <option value={Program.FYUGP}>FYUGP (4-Year UG)</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"></i>
            </div>
          </div>

          <div className="text-left">
            <label className="flex items-center gap-2 font-bold mb-3 uppercase tracking-widest text-xs opacity-60">
              <i className="fas fa-layer-group text-[#00bcd4]"></i> Semester Year
            </label>
            <div className="relative">
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                disabled={!program}
                className={`w-full p-4 rounded-xl outline-none appearance-none transition-all duration-300 border disabled:opacity-30
                  ${theme === 'dark' 
                    ? 'bg-black/20 border-white/10 text-white focus:border-[#00bcd4]' 
                    : 'bg-gray-100 border-black/10 text-gray-900 focus:border-[#2196f3]'}`}
              >
                <option value="">Choose semester</option>
                {availableSemesters.map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"></i>
            </div>
          </div>

          <button 
            type="submit" 
            className={`mt-4 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl text-white shadow-xl ${brandGradient}`}
          >
            PROCEED <i className="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>

      <div className="flex gap-4 mt-8">
        <Link to="/" className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 border-2
          ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-black/5 text-gray-600 hover:bg-gray-50 shadow-md'}`}>
          <i className="fas fa-home"></i> Home Dashboard
        </Link>
      </div>
    </Layout>
  );
};

export default SelectLevel;
