
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface ContributionCardProps {
  theme: 'light' | 'dark';
}

const ContributionCard: React.FC<ContributionCardProps> = ({ theme }) => {
  const [program, setProgram] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [dept, setDept] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [yearValue, setYearValue] = useState<string>(new Date().getFullYear().toString());
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading', msg: string } | null>(null);

  const availableSemesters = program === 'UG' ? 6 : program === 'PG' ? 4 : program === 'FYUGP' ? 8 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a file to upload.' });
      return;
    }

    setStatus({ type: 'loading', msg: 'Uploading your contribution...' });

    try {
      const sanitizedSubject = subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${sanitizedSubject}_${yearValue}_${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `${dept.toLowerCase()}/${program.toLowerCase()}/sem${semester}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('temp-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('upload_submissions')
        .insert([{
          subject: subject,
          department: dept,
          program: program,
          semester: parseInt(semester),
          year: parseInt(yearValue),
          file_path: filePath,
          notes: notes
        }]);

      if (dbError) {
        console.warn('File uploaded but metadata failed:', dbError);
      }

      setStatus({ type: 'success', msg: 'Upload successful! Thank you for contributing.' });
      
      setProgram('');
      setSemester('');
      setDept('');
      setSubject('');
      setNotes('');
      setFile(null);
      setTimeout(() => setStatus(null), 5000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus({ type: 'error', msg: err.message || 'Failed to upload. Please try again.' });
    }
  };

  return (
    <div className={`w-full max-w-2xl mt-10 p-6 sm:p-10 rounded-2xl backdrop-blur-xl animate-fade-slide shadow-2xl border
      ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/90 border-black/10 text-gray-800'}`}>
      
      {status && (
        <div className={`p-4 rounded-xl text-center mb-6 transition-all duration-300 font-medium
          ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
            status.type === 'loading' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {status.type === 'loading' && <i className="fas fa-spinner fa-spin mr-2"></i>}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-book text-cyan-500"></i> Program <span className="text-red-500">*</span></label>
            <select 
              value={program} 
              onChange={(e) => setProgram(e.target.value)} 
              required
              className={`w-full p-3 rounded-xl border outline-none appearance-none transition-all
                ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
            >
              <option value="" className="bg-slate-800 text-white">Select Program</option>
              <option value="ug" className="bg-slate-800 text-white">UG</option>
              <option value="pg" className="bg-slate-800 text-white">PG</option>
              <option value="fyugp" className="bg-slate-800 text-white">FYUGP</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-building text-cyan-500"></i> Department <span className="text-red-500">*</span></label>
            <select 
              value={dept} 
              onChange={(e) => setDept(e.target.value)} 
              required
              className={`w-full p-3 rounded-xl border outline-none appearance-none transition-all
                ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
            >
              <option value="" className="bg-slate-800 text-white">Select Department</option>
              <option value="English" className="bg-slate-800 text-white">English</option>
              <option value="Physics" className="bg-slate-800 text-white">Physics</option>
              <option value="Electronics" className="bg-slate-800 text-white">Electronics</option>
              <option value="Development Economics" className="bg-slate-800 text-white">Development Economics</option>
              <option value="Commerce" className="bg-slate-800 text-white">Commerce</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-layer-group text-cyan-500"></i> Semester <span className="text-red-500">*</span></label>
            <select 
              value={semester} 
              onChange={(e) => setSemester(e.target.value)} 
              required
              disabled={!program}
              className={`w-full p-3 rounded-xl border outline-none appearance-none transition-all disabled:opacity-50
                ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
            >
              <option value="" className="bg-slate-800 text-white">Select Semester</option>
              {Array.from({ length: availableSemesters }).map((_, i) => (
                <option key={i + 1} value={i + 1} className="bg-slate-800 text-white">Semester {i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-calendar-alt text-cyan-500"></i> Year <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              value={yearValue}
              onChange={(e) => setYearValue(e.target.value)}
              min="2000" 
              max={new Date().getFullYear()} 
              required
              className={`w-full p-3 rounded-xl border outline-none transition-all
                ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-book-open text-cyan-500"></i> Name of the paper <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="e.g. Digital Signal Processing" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className={`w-full p-3 rounded-xl border outline-none transition-all
              ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 font-medium mb-2"><i className="fas fa-sticky-note text-cyan-500"></i> Notes</label>
          <textarea 
            placeholder="Optional: syllabus version, special focus, or remarks"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`w-full p-3 rounded-xl border outline-none min-h-[100px] transition-all
              ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white focus:border-cyan-400' : 'bg-gray-100 border-black/10 text-gray-900 focus:border-cyan-500'}`}
          ></textarea>
        </div>

        <div>
          <label className="flex items-center gap-2 font-medium mb-3"><i className="fas fa-upload text-cyan-500"></i> Upload Question Paper</label>
          <input
            type="file"
            id="fileInput"
            required
            accept=".pdf,.jpg,.jpeg,.png,.docx"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="fileInput" className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all
            ${theme === 'dark' ? 'bg-white/5 border-white/30 hover:border-cyan-400 hover:bg-white/10' : 'bg-gray-50 border-black/20 hover:border-cyan-500 hover:bg-gray-100'}`}>
            <i className="fas fa-cloud-upload-alt text-4xl text-cyan-500 mb-3"></i>
            <span className="font-semibold text-center mb-1">{file ? file.name : 'Click to select a file'}</span>
            <small className="opacity-60">PDF, JPG, PNG, DOCX • Max 5MB</small>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={status?.type === 'loading'}
          className={`mt-4 py-4 rounded-[30px] font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
            ${theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'}`}
        >
          <i className="fas fa-upload"></i> {status?.type === 'loading' ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default ContributionCard;
