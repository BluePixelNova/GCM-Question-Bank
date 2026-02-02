
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Material } from '../types';
import { supabase } from '../services/supabase';

interface MaterialsPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const MaterialsPage: React.FC<MaterialsPageProps> = ({ theme, onToggleTheme }) => {
  const { dept, program, semester } = useParams<{ dept: string; program: string; semester: string }>();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        // Path structure: department/program/sem{number}/
        // Matches the screenshot: privet-files -> commerce -> pg -> sem1
        console.log('PARAMS:', { dept, program, semester });
        const folderPath = `${dept?.toLowerCase()}/${program?.toLowerCase()}/${semester}`;
        console.log('STORAGE PATH:', folderPath);
        // List files in the verified 'privet-files' bucket
        const { data, error: storageError } = await supabase
          .storage
          .from('privet-files')
          .list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (storageError) throw storageError;

        if (data) {
          const files = data
            .filter(file => !file.name.endsWith('/'))
            .map((file) => {
              const { data: publicUrlData } = supabase
                .storage
                .from('privet-files')
                .getPublicUrl(`${folderPath}${file.name}`);
              
              return {
                name: file.name,
                url: publicUrlData.publicUrl
              };
            });
          setMaterials(files);
        }
      } catch (err: any) {
        console.error('Integration Error:', err);
        setError('Failed to fetch materials. Please check your connection or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [dept, program, semester]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'fa-file-pdf text-red-500';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'fa-file-image text-blue-400';
    return 'fa-file-alt text-gray-400';
  };

  const brandGradient = theme === 'dark' 
    ? 'bg-gradient-to-r from-[#1e88e5] to-[#6c63ff]' 
    : 'bg-gradient-to-r from-[#2196f3] to-[#7b61ff]';

  return (
    <Layout 
      theme={theme} 
      onToggleTheme={onToggleTheme}
      title={`${dept?.toUpperCase()} - ${program?.toUpperCase()}`}
      subtitle={`Semester ${semester} Resources`}
    >
      <div className="w-full max-w-3xl mt-10 animate-fade-in flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 my-20">
            <i className="fas fa-circle-notch fa-spin text-4xl text-[#00bcd4]"></i>
            <p className="opacity-60 animate-pulse font-bold tracking-widest text-xs uppercase">Connecting to Privet-Files...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 my-10">
            <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
            <p className="font-bold">{error}</p>
          </div>
        ) : materials.length > 0 ? (
          <div className="w-full space-y-4">
            <ul className="flex flex-col gap-4 w-full">
              {materials.map((file, idx) => (
                <li 
                  key={idx}
                  className={`flex justify-between items-center p-5 rounded-2xl border backdrop-blur-md transition-all duration-500 hover:-translate-y-1
                    ${theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:shadow-[0_4px_30px_rgba(108,99,255,0.2)]' 
                      : 'bg-white border-black/5 text-gray-800 shadow-md hover:shadow-xl'}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                      <i className={`fas ${getFileIcon(file.name)} text-xl`}></i>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold truncate text-sm sm:text-base" title={file.name}>{file.name}</span>
                      <span className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Verified Material</span>
                    </div>
                  </div>
                  <a 
                    href={file.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm flex-shrink-0 transition-all duration-300 text-white shadow-lg hover:brightness-110 ${brandGradient}`}
                  >
                    VIEW / DOWNLOAD
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-20 px-10 rounded-3xl border-2 border-dashed border-white/10 opacity-60">
            <i className="fas fa-cloud-moon text-7xl mb-6 text-[#00bcd4]/50"></i>
            <h3 className="text-2xl font-bold mb-2">Archive Empty</h3>
            <p className="max-w-xs mx-auto text-sm">We haven't indexed any papers for this semester yet.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-16 mb-10 w-full max-w-sm">
          <Link 
            to={`/department/${dept}`}
            className={`flex-1 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:-translate-y-1 shadow-2xl text-white ${brandGradient}`}
          >
            <i className="fas fa-arrow-left"></i> BACK
          </Link>
          <Link 
            to="/"
            className={`flex-1 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:-translate-y-1 shadow-2xl text-white ${brandGradient}`}
          >
            <i className="fas fa-home"></i> HOME
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default MaterialsPage;
