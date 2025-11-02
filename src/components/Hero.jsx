import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient overlays that don't block interactions */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-950/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6 text-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur">
          <Star className="h-3.5 w-3.5 text-yellow-300" aria-hidden />
          <span className="text-white/80">Tech • Portfolio • Interactive</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Portfolio Performance Analyzer
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
          Upload your project data to visualize skill distribution, explore a timeline, and track impact — all in your browser.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#uploader"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          >
            <Rocket className="h-4 w-4" aria-hidden />
            Get Started
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 underline-offset-4 hover:underline"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
