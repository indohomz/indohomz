import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 1. The Video Background */}
      <video
        className="absolute top-0 left-0 min-h-full min-w-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-fallback.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. The Dark Overlay (The "Cinematic" Look) */}
      <div className="absolute top-0 left-0 h-full w-full bg-black/40 z-10" />

      {/* 3. The Content Layer */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        
        {/* Animated Badge */}
        <div className="mb-6 animate-fade-in-up flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md border border-white/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium tracking-wide">Live in Gurgaon & Noida</span>
        </div>

        {/* Main Headline */}
        <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl drop-shadow-lg">
          Don't Just Rent. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Live The Experience.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl text-lg sm:text-xl text-gray-200 drop-shadow-md">
          Fully furnished spaces with high-speed WiFi, housekeeping, and a community that feels like family. Zero brokerage.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button 
            onClick={() => {
              const el = document.getElementById('properties');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold transition-all hover:bg-blue-700 hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            Find My Room
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/20 border border-white/30">
            <MapPin className="h-5 w-5" />
            Explore Areas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
