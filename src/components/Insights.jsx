import React, { useMemo } from 'react';
import { BarChart2, PieChart as PieIcon, Download, Activity } from 'lucide-react';

export default function Insights({ projects, onExport }) {
  const { skillCounts, avgImpact, filtered } = useMemo(() => summarize(projects), [projects]);

  return (
    <section aria-labelledby="insights-heading" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
            <Activity className="h-5 w-5 text-cyan-300" aria-hidden />
          </div>
          <div>
            <h2 id="insights-heading" className="text-lg font-medium">Insights</h2>
            <p className="text-xs text-white/70">Skill distribution, timeline, and impact</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onExport(filtered)}
          className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          <Download className="h-4 w-4" aria-hidden /> Export JSON
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-white/70">Upload a CSV to see charts and metrics.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/80">
              <PieIcon className="h-4 w-4" aria-hidden /> Skill distribution
            </div>
            <SVGDonut data={skillCounts} />
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/80">
              <BarChart2 className="h-4 w-4" aria-hidden /> Project timeline (months)
            </div>
            <TimelineChart items={filtered} />
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4 md:col-span-2">
            <MetricCards avgImpact={avgImpact} total={filtered.length} />
          </div>
        </div>
      )}
    </section>
  );
}

function summarize(projects) {
  const filtered = projects;
  const skillCounts = new Map();
  let totalImpact = 0;
  projects.forEach((p) => {
    totalImpact += Number(p.impact_score || 0);
    (p.skills || []).forEach((s) => {
      skillCounts.set(s, (skillCounts.get(s) || 0) + 1);
    });
  });
  const avgImpact = projects.length ? totalImpact / projects.length : 0;
  return { skillCounts, avgImpact, filtered };
}

function SVGDonut({ data }) {
  // Convert Map to array of {label, value}
  const entries = Array.from(data.entries()).map(([label, value]) => ({ label, value }));
  const total = entries.reduce((a, b) => a + b.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const palette = ['#60a5fa', '#34d399', '#f472b6', '#f59e0b', '#a78bfa', '#22d3ee', '#fb7185'];

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 180 180" className="h-48 w-48">
        <g transform="translate(90,90)">
          <circle r={radius} fill="transparent" stroke="#0f172a" strokeWidth="22" />
          {entries.map((e, i) => {
            const fraction = total ? e.value / total : 0;
            const dash = fraction * circumference;
            const dashArray = `${dash} ${circumference - dash}`;
            const strokeDashoffset = -offset;
            offset += dash;
            return (
              <circle
                key={e.label}
                r={radius}
                fill="transparent"
                stroke={palette[i % palette.length]}
                strokeWidth="22"
                strokeDasharray={dashArray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90)"
              />
            );
          })}
        </g>
      </svg>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {entries.map((e, i) => (
          <span key={e.label} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-white/80">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: palette[i % palette.length] }}
              aria-hidden
            />
            {e.label} <span className="text-white/60">({e.value})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineChart({ items }) {
  // Normalize durations and layout vertically
  const maxDuration = Math.max(1, ...items.map((p) => Number(p.duration_months) || 0));
  return (
    <div className="w-full overflow-x-auto">
      <svg className="h-auto min-w-[480px]" viewBox={`0 0 640 ${items.length * 36 + 30}`}>
        {/* Axis */}
        <line x1="80" y1="15" x2="620" y2="15" stroke="#1f2937" strokeWidth="2" />
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={80 + (540 * t)} y1="15" x2={80 + (540 * t)} y2={items.length * 36 + 15} stroke="#111827" strokeWidth="1" />
            <text x={80 + (540 * t)} y="10" textAnchor="middle" className="fill-white/60" fontSize="10">
              {Math.round(maxDuration * t)}m
            </text>
          </g>
        ))}

        {items.map((p, idx) => {
          const y = 36 * (idx + 1);
          const w = (Math.min(maxDuration, Number(p.duration_months) || 0) / maxDuration) * 540;
          return (
            <g key={p.id}>
              <text x="72" y={y} textAnchor="end" alignmentBaseline="middle" className="fill-white/85" fontSize="11">
                {p.project_name}
              </text>
              <rect x="80" y={y - 9} width={Math.max(4, w)} height="18" rx="4" className="fill-indigo-500/70" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MetricCards({ avgImpact, total }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/70">Projects</p>
        <p className="mt-1 text-2xl font-semibold">{total}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/70">Average impact score</p>
        <p className="mt-1 text-2xl font-semibold">{avgImpact.toFixed(2)}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-white/70">Quick tip</p>
        <p className="mt-1 text-sm text-white/80">Use filters above to focus on skills that matter.</p>
      </div>
    </div>
  );
}
