
import React from 'react';
import { LevelProgress } from '../types';

interface LevelMapProps {
  progress: LevelProgress[];
  onSelectLevel: (levelId: number) => void;
  onOpenKnowledgeBase: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({ progress, onSelectLevel, onOpenKnowledgeBase }) => {
  
  // Coordinates for the planets (percentages)
  const levels = [
    { id: 1, x: 20, y: 60, theme: 'cyan' },
    { id: 2, x: 45, y: 30, theme: 'purple' },
    { id: 3, x: 70, y: 60, theme: 'orange' },
    { id: 4, x: 90, y: 30, theme: 'red' },
  ];

  const getPlanetStyle = (theme: string, unlocked: boolean) => {
      if (!unlocked) return 'grayscale opacity-50 contrast-125';
      switch(theme) {
          case 'cyan': return 'bg-gradient-to-br from-cyan-300 via-blue-500 to-blue-900 shadow-[0_0_30px_rgba(6,182,212,0.6)]';
          case 'purple': return 'bg-gradient-to-br from-fuchsia-300 via-purple-600 to-indigo-900 shadow-[0_0_30px_rgba(147,51,234,0.6)]';
          case 'orange': return 'bg-gradient-to-br from-yellow-300 via-orange-500 to-red-900 shadow-[0_0_30px_rgba(234,88,12,0.6)]';
          case 'red': return 'bg-gradient-to-br from-red-300 via-red-600 to-rose-900 shadow-[0_0_30px_rgba(225,29,72,0.6)]';
          default: return 'bg-gray-500';
      }
  };

  // Corrected Path to flow through 20,60 -> 45,30 -> 70,60 -> 90,30
  const pathD = "M 20 60 C 32.5 60, 32.5 30, 45 30 C 57.5 30, 57.5 60, 70 60 C 80 60, 80 30, 90 30";

  return (
    <div className="w-full h-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* --- COSMIC BACKGROUND LAYERS --- */}
      
      {/* 1. Deep Space Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020617_100%)] z-0"></div>

      {/* 2. Animated Cosmic Waves (Nebulas) */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-60">
          {/* Blue Wave */}
          <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-wave-slow"></div>
          {/* Purple Wave */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen animate-wave-slow delay-1000"></div>
          {/* Green Glow */}
          <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse-slow"></div>
      </div>

      {/* 3. Starfield & Floating Voxels */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
      <div className="absolute inset-0 z-0">
         {[...Array(30)].map((_, i) => (
            <div 
                key={i}
                className="absolute bg-white rounded-full animate-twinkle"
                style={{
                    width: Math.random() * 3 + 'px',
                    height: Math.random() * 3 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 5 + 's',
                    opacity: Math.random()
                }}
            ></div>
         ))}
         {/* Floating Data Cubes */}
         {[...Array(6)].map((_, i) => (
             <div 
                key={`cube-${i}`}
                className="absolute border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm animate-float-random"
                style={{
                    width: '40px',
                    height: '40px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: (15 + Math.random() * 10) + 's',
                    transform: `rotate(${Math.random() * 360}deg)`
                }}
             />
         ))}
      </div>

      {/* --- CONTENT --- */}

      <div className="z-20 text-center mb-16 mt-12 relative group cursor-default">
          <div className="absolute -inset-10 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <h1 className="relative text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-blue-400 mb-4 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] tracking-tighter transform group-hover:scale-105 transition-transform duration-500">
              MISSION SELECT
          </h1>
          
          <div className="relative h-1 w-32 mx-auto overflow-hidden rounded-full bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-slide-gradient"></div>
          </div>
          
          <p className="mt-4 text-cyan-200/80 font-mono text-xs tracking-[0.5em] uppercase animate-pulse">
              Traverse the Repository
          </p>
      </div>

      {/* --- MAP CONTAINER --- */}
      <div className="relative w-full max-w-6xl h-[450px] z-10 perspective-1000">
          
          {/* SVG PATH CONNECTOR */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(100,200,255,0.3)]" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs>
                 <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#22d3ee" />
                     <stop offset="50%" stopColor="#a855f7" />
                     <stop offset="100%" stopColor="#f97316" />
                 </linearGradient>
             </defs>
             {/* Background Rail */}
             <path 
                d={pathD} 
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="4" 
             />
             <path 
                d={pathD} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
             />
             {/* Active Flowing Path */}
             <path 
                d={pathD}
                fill="none" 
                stroke="url(#pathGradient)" 
                strokeWidth="3" 
                strokeDasharray="15 15"
                strokeLinecap="round"
                className="animate-dash-flow opacity-80"
             />
          </svg>

          {/* LEVELS (PLANETS) */}
          {levels.map((level) => {
              const levelData = progress.find(p => p.levelId === level.id) || { unlocked: false, stars: 0 };
              const isUnlocked = levelData.unlocked;

              return (
                  <div 
                    key={level.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
                    style={{ left: `${level.x}%`, top: `${level.y}%` }}
                  >
                      {/* Planet Button */}
                      <button
                        onClick={() => isUnlocked && onSelectLevel(level.id)}
                        disabled={!isUnlocked}
                        className={`
                            relative w-28 h-28 rounded-full transition-all duration-500 ease-out
                            ${isUnlocked ? 'hover:scale-125 hover:rotate-6 cursor-pointer hover:z-30' : 'cursor-not-allowed grayscale opacity-60'}
                        `}
                      >
                          {/* 3D Planet Body */}
                          <div className={`absolute inset-0 rounded-full ${getPlanetStyle(level.theme, isUnlocked)} overflow-hidden shadow-2xl`}>
                               {/* Texture Overlay */}
                               <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-overlay"></div>
                               {/* Atmospheric Shine */}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/30 rounded-full"></div>
                               {/* Crater Details (CSS shapes) */}
                               <div className="absolute top-[20%] left-[30%] w-[15%] h-[10%] bg-black/20 rounded-full blur-[2px]"></div>
                               <div className="absolute bottom-[30%] right-[20%] w-[25%] h-[15%] bg-black/10 rounded-full blur-[4px]"></div>
                          </div>

                          {/* Lock Overlay */}
                          {!isUnlocked && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-[2px] border border-gray-500/50">
                                  <span className="text-3xl filter drop-shadow-[0_0_10px_black] opacity-80">🔒</span>
                              </div>
                          )}

                          {/* Orbit Ring (Active) */}
                          {isUnlocked && (
                            <div className="absolute -inset-6 border border-white/10 rounded-full w-[150%] h-[150%] top-[-25%] left-[-25%] animate-spin-slow pointer-events-none">
                                <div className="absolute top-[50%] right-[-3px] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                            </div>
                          )}
                          
                          {/* Level Number */}
                          {isUnlocked && (
                              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur border border-white/20 px-4 py-1 rounded-full text-white font-black text-lg shadow-[0_5px_15px_black] z-30 group-hover:scale-110 transition-transform">
                                  {level.id}
                              </div>
                          )}
                      </button>

                      {/* Stars Display (Floating Below) */}
                      {isUnlocked && (
                        <div className="absolute top-[115%] left-1/2 -translate-x-1/2 flex flex-col items-center w-48 pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3].map(star => (
                                    <svg 
                                        key={star} 
                                        className={`w-5 h-5 ${star <= levelData.stars ? 'text-yellow-400 fill-current drop-shadow-[0_0_8px_gold] animate-pulse' : 'text-gray-800 fill-current'}`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                ))}
                            </div>
                            <div className={`text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md shadow-lg ${level.id === 1 ? 'text-cyan-400 shadow-cyan-900/20' : level.id === 2 ? 'text-purple-400 shadow-purple-900/20' : level.id === 3 ? 'text-orange-400 shadow-orange-900/20' : 'text-red-400 shadow-red-900/20'}`}>
                                {level.id === 1 ? 'Detached Bridge' : level.id === 2 ? 'Revert Realm' : level.id === 3 ? 'Cherry Pick' : 'Rebase Ridge'}
                            </div>
                        </div>
                      )}
                  </div>
              )
          })}
      </div>

      <div className="mt-16 z-20">
          <button 
             onClick={onOpenKnowledgeBase}
             className="relative group px-10 py-5 bg-gray-950 border border-indigo-500/30 rounded-full overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center gap-4">
                  <span className="text-3xl animate-bounce filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">📚</span> 
                  <span className="text-indigo-200 group-hover:text-white font-bold tracking-widest font-mono text-sm transition-colors">ACCESS KNOWLEDGE BASE</span>
              </div>
          </button>
      </div>

      <style>{`
        @keyframes wave-slow {
            0% { transform: translate(0, 0) rotate(0deg) scale(1); }
            50% { transform: translate(20px, -20px) rotate(5deg) scale(1.1); }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        .animate-wave-slow {
            animation: wave-slow 20s ease-in-out infinite;
        }
        
        @keyframes dash-flow {
            to { stroke-dashoffset: -100; }
        }
        .animate-dash-flow {
            animation: dash-flow 3s linear infinite;
        }

        .perspective-1000 {
            perspective: 1000px;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle { animation: twinkle 4s ease-in-out infinite; }

        @keyframes float-random {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -50px) rotate(120deg); }
            66% { transform: translate(-20px, 40px) rotate(240deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-float-random { animation: float-random 20s linear infinite; }
        
        @keyframes slide-gradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .animate-slide-gradient {
            background-size: 200% 200%;
            animation: slide-gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
