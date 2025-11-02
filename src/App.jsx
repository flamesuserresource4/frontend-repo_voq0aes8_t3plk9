import React, { useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import UploadSection from './components/UploadSection.jsx';
import Filters from './components/Filters.jsx';
import Insights from './components/Insights.jsx';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const allSkills = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.skills || []).forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedSkills.length === 0) return projects;
    return projects.filter((p) => p.skills?.some((s) => selectedSkills.includes(s)));
  }, [projects, selectedSkills]);

  const handleUpload = (rows) => {
    setProjects(rows);
    // Auto-select none on fresh upload
    setSelectedSkills([]);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const handleExport = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-insights.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <Hero />

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="md:col-span-2">
            <UploadSection onData={handleUpload} />
          </div>
          <div className="md:col-span-1">
            <Filters allSkills={allSkills} selectedSkills={selectedSkills} onToggle={toggleSkill} />
          </div>
        </div>

        <div className="mt-6">
          <Insights projects={filteredProjects} onExport={handleExport} />
        </div>

        <footer className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
          <p>
            Example CSV columns: project_name, skills, duration_months, impact_score
          </p>
          <p>
            Built with React, Tailwind, and a 3D Spline scene.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
