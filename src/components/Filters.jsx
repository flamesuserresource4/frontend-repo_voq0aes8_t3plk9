import React from 'react';
import { Filter } from 'lucide-react';

export default function Filters({ allSkills, selectedSkills, onToggle }) {
  return (
    <section aria-labelledby="filters-heading" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
          <Filter className="h-5 w-5 text-emerald-300" aria-hidden />
        </div>
        <div>
          <h2 id="filters-heading" className="text-lg font-medium">Filter by skill</h2>
          <p className="text-xs text-white/70">Toggle one or more skills to refine the view</p>
        </div>
      </div>

      {allSkills.length === 0 ? (
        <p className="text-sm text-white/70">Upload data to see available skills.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => onToggle(skill)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                    : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
                aria-pressed={active}
                aria-label={`Filter by ${skill}`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
