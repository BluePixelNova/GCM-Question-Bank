
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';

interface UploadPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ theme, onToggleTheme }) => {
  const [program, setProgram] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [dept, setDept] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [yearValue, setYearValue] = useState<string>(new Date().getFullYear().toString());
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);

  // FYUGP updated to 8 semesters
  const availableSemesters = program === 'UG' ? 6 : program === 'PG' ? 4 : program === 'FYUGP' ? 8 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a file to upload.' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Submitting to review queue...' });

    try {
      const semNum = parseInt(semester, 10);
      const yearNum = parseInt(yearValue, 10);

      const sanitizedSubject = subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileExt = file.name.split('.').pop();
      const fileName = `${sanitizedSubject}_${yearNum}_${Date.now()}.${fileExt}`;
      
      // Follow the logic: department/program/semX/
      const folderPath = `${dept.toLowerCase()}/${program.toLowerCase()}/sem${semNum}/`;
      const filePath = `${folderPath}${fileName}`;

      // Upload to 'uploads' bucket (unverified pool)
      const { error: uploadError } = await supabase.storage
        .from('temp-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Metadata helps the manual verification process
      const { error: dbError } = await supabase
        .from('upload_submissions')
        .insert([{
          subject: subject,
          department: dept,
          program: program,
          semester: semNum,
          year: yearNum,
          file_path: filePath,
          notes: notes,
          verified: false // Flag for manual check
        }]);

      if (dbError) {
        console.warn('Metadata recording issue:', dbError);
      }

      setStatus({ type: 'success', msg: 'Submission successful! It will appear live after verification.' });
      
      setProgram('');
      setSemester('');
      setDept('');
      setSubject('');
      setNotes('');
      setFile(null);
      setTimeout(() => setStatus(null), 6000);

    } catch (err: any) {
      console.error('Upload Process Error:', err);
      setStatus({ type: 'error', msg: 'Storage Connection Error. Please check if the "uploads" bucket exists.' });
    }
  };

  const inputBaseClasses = `w-full p-[14px_16px] rounded-[14px] border outline-none transition-all duration-300 backdrop-blur-md font-medium`;
  const inputThemeClasses = theme === 'dark' 
    ? `bg-black/30 border-white/20 text-white placeholder-white/30 focus:border-[#00bcd4] focus:bg-black/50` 
    : `bg-white border-black/20 text-gray-900 placeholder-gray-400 focus:border-[#2196f3] focus:ring-2 focus:ring-[#2196f3]/20 shadow-inner`;

  return (
    <Layout 
      theme={theme} 
      onToggleTheme={onToggleTheme}
      title="Contribution Portal"
      subtitle="Help grow the repository by uploading verified question papers."
    >
      <div className={`w-full max-w-2xl mt-8 p-6 sm:p-10 rounded-2xl backdrop-blur-xl animate-fade-slide shadow-2xl border
        ${theme === 'dark' ? 'bg-white/10 border-white/15' : 'bg-white/95 border-black/5 text-gray-800'}`}>
        
        {status && (
          <div className={`p-4 rounded-xl text-center mb-8 transition-all duration-300 font-bold border-2 animate-fade-in
            ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 
              status.type === 'loading' ? 'bg-[#00bcd4]/10 text-[#00bcd4] border-[#00bcd4]/30' :
              'bg-red-500/10 text-red-500 border-red-500/30'}`}>
            {status.type === 'loading' && <i className="fas fa-circle-notch fa-spin mr-3"></i>}
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="flex items-center gap-2 font-bold mb-2 text-xs uppercase tracking-widest opacity-70">
                <i className="fas fa-graduation-cap text-[#00bcd4]"></i> Program <span className="text-red-500">*</span>
              </label>
              <select 
                value={program} 
                onChange={(e) => setProgram(e.target.value)} 
                required
                className={`${inputBaseClasses} ${inputThemeClasses} appearance-none cursor-pointer`}
              >
                <option value="">Select Program</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="FYUGP">FYUGP</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="flex items-center gap-2 font-bold mb-2 text-xs uppercase tracking-widest opacity-70">
                <i className="fas fa-university text-[#00bcd4]"></i> Department <span className="text-red-500">*</span>
              </label>
              <select 
                value={dept} 
                onChange={(e) => setDept(e.target.value)} 
                required
                className={`${inputBaseClasses} ${inputThemeClasses} appearance-none cursor-pointer`}
              >
                <option value="">Select Department</option>
                <option value="English">English</option>
                <option value="Physics">Physics</option>
                <option value="Electronics">Electronics</option>
                <option value="Development Economics">Development Economics</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="flex items-center gap-2 font-bold mb-2 text-xs uppercase tracking-widest opacity-70">
                <i className="fas fa-layer-group text-[#00bcd4]"></i> Semester <span className="text-red-500">*</span>
              </label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)} 
                required
                disabled={!program}
                className={`${inputBaseClasses} ${inputThemeClasses} appearance-none disabled:opacity-30 cursor-pointer`}
              >
                <option value="">Select Semester</option>
                {Array.from({ length: availableSemesters }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="flex items-center gap-2 font-bold mb-2 text-xs uppercase tracking-widest opacity-70">
                <i className="fas fa-calendar-check text-[#00bcd4]"></i> Exam Year <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={yearValue}
                onChange={(e) => setYearValue(e.target.value)}
                min="2010" 
                max={new Date().getFullYear()} 
                required
                className={`${inputBaseClasses} ${inputThemeClasses}`}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="flex items-center gap-2 font-bold mb-2 text-xs uppercase tracking-widest opacity-70">
              <i className="fas fa-file-signature text-[#00bcd4]"></i> Subject / Paper Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Quantum Mechanics" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className={`${inputBaseClasses} ${inputThemeClasses}`}
            />
          </div>
          <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Additional Notes (Optional)</label>
              <textarea 
                placeholder="Add details like specific month or exam cycle..." 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className={`${inputBaseClasses} ${inputThemeClasses} min-h-[100px] resize-none`}
              />
          </div>
          <div className="relative">
            <label className="flex items-center gap-2 font-bold mb-3 text-xs uppercase tracking-widest opacity-70">
              <i className="fas fa-cloud-upload-alt text-[#00bcd4]"></i> Attachment <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="fileInput"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="fileInput" className={`flex flex-col items-center justify-center p-10 rounded-[20px] border-2 border-dashed cursor-pointer transition-all duration-500
              ${theme === 'dark' 
                ? 'bg-black/40 border-white/20 hover:border-[#00bcd4] hover:bg-black/60 hover:shadow-[0_0_25px_rgba(0,188,212,0.2)]' 
                : 'bg-black/5 border-black/10 hover:border-[#2196f3] hover:bg-white hover:shadow-xl'}`}>
              <i className="fas fa-file-upload text-4xl text-[#00bcd4] mb-4"></i>
              <span className={`text-sm font-bold tracking-tight text-center ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                {file ? file.name : 'Click to select Paper'}
              </span>
              <p className="text-[10px] uppercase tracking-widest font-bold mt-2 opacity-50">PDF or Image • Max 5MB</p>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={status?.type === 'loading'}
            className={`group mt-4 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden
              ${theme === 'dark' 
                ? 'bg-gradient-to-r from-[#1e88e5] to-[#6c63ff] text-white hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]' 
                : 'bg-gradient-to-r from-[#2196f3] to-[#7b61ff] text-white hover:shadow-[0_0_30px_rgba(33,150,243,0.4)]'}`}
          >
            <i className={`fas ${status?.type === 'loading' ? 'fa-sync fa-spin' : 'fa-paper-plane'} transition-transform group-hover:rotate-12`}></i>
            {status?.type === 'loading' ? 'Submitting...' : 'Upload for Verification'}
          </button>
        </form>
      </div>
      
        {/* Project Description Card - Highly Distinct */}
        <div className={`w-full mt-8 p-8 sm:p-10 rounded-[40px] border shadow-2xl animate-fade-in
          ${theme === 'dark' ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-100 shadow-sky-900/5'}`}>
          <div className="flex items-start gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-sky-500/20' : 'bg-white shadow-md'}`}>
              <i className="fas fa-info-circle text-sky-500 text-2xl"></i>
            </div>
            <div>
              <h4 className={`text-xs font-black uppercase tracking-[0.3em] mb-3 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`}>
                Project Description
              </h4>
              <p className={`text-base leading-relaxed font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                This project is a student-led initiative at GCM College, designed to unify and organize educational materials for easy access and interactive use. It provides an intuitive interface where students can search, upload, and navigate study resources efficiently, fostering collaboration and streamlined learning.
              </p>
            </div>
          </div>
        </div>
      <div className="mt-12 mb-10">
        <Link to="/" className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 border-2
          ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-black/5 text-gray-600 hover:bg-gray-50 shadow-md'}`}>
          <i className="fas fa-home"></i> Back to Dashboard
        </Link>
      </div>

    </Layout>
  );
};

export default UploadPage;
