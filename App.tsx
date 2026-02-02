
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SelectLevel from './pages/SelectLevel';
import MaterialsPage from './pages/MaterialsPage';
import SearchResults from './pages/SearchResults';
import UploadPage from './pages/UploadPage';
import WIP from './pages/WIP';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/department/:dept" element={<SelectLevel theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/materials/:dept/:program/:semester" element={<MaterialsPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/search" element={<SearchResults theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/upload" element={<UploadPage theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="/wip" element={<WIP theme={theme} onToggleTheme={toggleTheme} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
