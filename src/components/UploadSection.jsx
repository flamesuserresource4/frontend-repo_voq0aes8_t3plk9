import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';

/**
 * UploadSection handles CSV upload and basic validation.
 * Expected headers: project_name, skills, duration_months, impact_score
 */
export default function UploadSection({ onData }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFiles = async (file) => {
    setError('');
    setFileName(file?.name || '');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file.');
      return;
    }
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const projects = normalizeRows(rows);
      onData(projects);
    } catch (e) {
      console.error(e);
      setError('Could not parse the file. Please check the format.');
    }
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFiles(file);
  };

  return (
    <section id="uploader" aria-labelledby="upload-heading" className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
          <FileSpreadsheet className="h-5 w-5 text-indigo-300" aria-hidden />
        </div>
        <div>
          <h2 id="upload-heading" className="text-lg font-medium">Upload CSV</h2>
          <p className="text-xs text-white/70">project_name, skills (comma-separated), duration_months, impact_score (1-10)</p>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="file-input"
          className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-white/15 bg-white/5 px-4 py-4 hover:border-white/25 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
              <Upload className="h-5 w-5 text-white/80" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium">{fileName || 'Choose a CSV file'}</p>
              <p className="text-xs text-white/60">Click to browse</p>
            </div>
          </div>
          <span className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white group-hover:bg-indigo-400">Select file</span>
        </label>
        <input
          id="file-input"
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={onInputChange}
          className="sr-only"
          aria-describedby="upload-heading"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-500/15 px-3 py-2 text-sm text-red-200">
          <AlertCircle className="h-4 w-4" aria-hidden />
          {error}
        </p>
      )}

      <div id="how-it-works" className="mt-4 text-sm text-white/75">
        <p>Tip: You can paste data into a spreadsheet and export as CSV. Each row represents a project.</p>
      </div>
    </section>
  );
}

// RFC4180-compliant-ish CSV parser handling quotes and commas within quotes
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    if (cols.length === 1 && cols[0].trim() === '') continue; // skip blank lines
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? '').trim();
    });
    rows.push(obj);
  }
  return rows;
}

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((c) => c.replace(/^\s+|\s+$/g, ''));
}

function normalizeRows(rows) {
  // Map CSV fields to a clean shape and coerce types
  return rows.map((r, idx) => {
    const name = r.project_name || r.name || `Project ${idx + 1}`;
    const duration = Number(r.duration_months || r.duration || 0) || 0;
    const impact = Number(r.impact_score || r.impact || 0) || 0;
    const skills = (r.skills || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return { id: `p-${idx}`, project_name: name, duration_months: duration, impact_score: impact, skills };
  });
}
