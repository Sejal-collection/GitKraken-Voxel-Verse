
import React, { useEffect, useState, useRef } from 'react';
import { GameState } from '../types';

interface UIProps {
  state: GameState;
  onNextLevel: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  startGame: () => void;
  onExit: () => void;
}

export const GameUI: React.FC<UIProps> = ({ state, onNextLevel, toggleMute, isMuted, startGame, onExit }) => {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
        if (containerRef.current) {
            const { width, height, left, top } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - left - width / 2) / 25; // Sensitivity
            const y = (e.clientY - top - height / 2) / 25;
            setMousePos({ x, y });
        }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderArrow = (key: string) => {
      switch(key) {
          case 'ArrowUp': return '↑';
          case 'ArrowDown': return '↓';
          case 'ArrowLeft': return '←';
          case 'ArrowRight': return '→';
          default: return '?';
      }
  };

  // --- INTRO SCREEN: HIGH ENERGY MONTAGE ---
  if (state.status === 'INTRO') {
    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-mono bg-[#020617] perspective-container cursor-crosshair">
            
            {/* --- MONTAGE BACKGROUND --- */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-60">
                {/* 1. Warp Speed Stars */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-warp-speed"></div>
                
                {/* 2. The Growing Graph (Background) */}
                <svg className="absolute top-0 left-0 w-full h-full opacity-40 mix-blend-screen" preserveAspectRatio="none">
                    <path 
                        d="M -100 500 Q 300 100 600 500 T 1500 500" 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="8" 
                        className="animate-draw-graph drop-shadow-[0_0_15px_cyan]"
                    />
                    <path 
                        d="M -100 600 Q 400 300 800 600" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="6" 
                        strokeDasharray="20 20"
                        className="animate-draw-graph-slow drop-shadow-[0_0_10px_purple]"
                    />
                </svg>

                {/* 3. Flying Voxel Debris */}
                <div className="absolute inset-0 perspective-distant">
                     {[...Array(12)].map((_, i) => (
                         <div 
                            key={`block-${i}`}
                            className="absolute w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 border border-white/20 shadow-[0_0_20px_cyan] animate-fly-block"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: `-10%`,
                                animationDelay: `${i * 0.3}s`,
                                animationDuration: `${2.5 + Math.random() * 1.5}s`,
                                opacity: 0.8
                            }}
                         ></div>
                     ))}
                </div>

                {/* 4. Hopping Keif (Center Stage Background) */}
                <div className="absolute bottom-10 right-10 md:bottom-20 md:right-40 transform scale-[2] md:scale-[4] opacity-50 blur-[2px] mix-blend-luminosity">
                     <div className="w-16 h-16 bg-green-500 rounded-xl relative animate-hop-beat shadow-[0_20px_50px_green]">
                         <div className="absolute top-4 left-4 w-4 h-4 bg-black rounded-full"></div>
                         <div className="absolute top-4 right-4 w-4 h-4 bg-black rounded-full"></div>
                         <div className="absolute bottom-[-10px] left-2 w-4 h-8 bg-green-600 rounded-full"></div>
                         <div className="absolute bottom-[-10px] right-2 w-4 h-8 bg-green-600 rounded-full"></div>
                         {/* Tentacles flailing */}
                         <div className="absolute -left-4 bottom-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                         <div className="absolute -right-4 bottom-2 w-4 h-4 bg-green-500 rounded-full animate-pulse delay-75"></div>
                     </div>
                </div>
            </div>

            {/* --- MAIN TITLE CONTENT --- */}
            <div 
                className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{
                    transform: `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`
                }}
            >
                
                {/* 3D SPINNING TITLE */}
                <div className="mb-12 relative group perspective-1000">
                   <div className="transform-style-3d animate-float-slow relative">
                       <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-300 to-purple-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)] tracking-tighter uppercase whitespace-nowrap animate-pulse-beat">
                           VOXEL VERSE
                       </h1>
                       {/* Reflection/Shadow for 3D feel */}
                       <h1 className="absolute top-0 left-0 text-7xl md:text-9xl font-black text-cyan-500/10 blur-sm transform translate-z-[-30px] scale-105 select-none pointer-events-none uppercase whitespace-nowrap">
                           VOXEL VERSE
                       </h1>
                       {/* Glitch Overlay */}
                       <h1 className="absolute top-0 left-0 text-7xl md:text-9xl font-black text-white/20 transform translate-x-[2px] mix-blend-overlay opacity-0 group-hover:opacity-100 animate-glitch select-none pointer-events-none uppercase whitespace-nowrap">
                           VOXEL VERSE
                       </h1>
                   </div>
                   
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-4 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-lg opacity-50 animate-pulse-beat"></div>
                </div>

                {/* SUBTITLE */}
                <div className="mb-16 flex items-center gap-4 animate-fade-in-up delay-300">
                    <div className="bg-green-500/10 text-green-400 px-4 py-1.5 rounded border border-green-500/50 font-bold text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-sm">
                        GitKraken Game Jam
                    </div>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span className="text-cyan-200 font-mono text-sm tracking-widest typewriter">
                        v1.0.0 // SYSTEM_READY
                    </span>
                </div>

                {/* INITIALIZE BUTTON */}
                <button 
                  onClick={startGame}
                  className="group relative px-20 py-8 bg-transparent overflow-hidden transform hover:scale-110 transition-all duration-200 animate-bounce-slight"
                >
                    {/* Button Background Layers */}
                    <div className="absolute inset-0 bg-cyan-950 skew-x-[-15deg] border-2 border-cyan-400 group-hover:bg-cyan-900 group-hover:border-cyan-200 shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all"></div>
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.05)_5px,rgba(255,255,255,0.05)_10px)] opacity-50"></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine skew-x-[-15deg]"></div>
                    
                    {/* Text & Icon */}
                    <span className="relative z-10 text-4xl font-black text-white italic tracking-widest flex items-center gap-4 group-hover:text-cyan-100 text-shadow-neon">
                        <span className="text-5xl animate-pulse text-green-400">▶</span> 
                        START GAME
                    </span>
                    
                    {/* Tech Decor */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white drop-shadow-md"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white drop-shadow-md"></div>
                </button>
                
                <p className="mt-12 text-slate-500 font-mono text-xs animate-pulse tracking-widest">
                    [ PRESS ANY KEY OR CLICK TO INITIALIZE REPOSITORY ]
                </p>
            </div>
            
            <style>{`
                .perspective-container { perspective: 1200px; }
                .perspective-distant { perspective: 2000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .text-shadow-neon { text-shadow: 0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(6,182,212,0.5); }
                
                @keyframes beat {
                    0%, 100% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.02); filter: brightness(1.2); }
                }
                .animate-pulse-beat { animation: beat 0.66s ease-in-out infinite; } /* Matches 90BPM */

                @keyframes hop-beat {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-40px) scale(1.1) rotate(5deg); }
                }
                .animate-hop-beat { animation: hop-beat 1.32s ease-in-out infinite; } /* Every 2 beats */

                @keyframes fly-block {
                    0% { transform: translateZ(-500px) rotate(0deg); left: -10%; opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateZ(500px) rotate(360deg); left: 120%; opacity: 0; }
                }
                .animate-fly-block { animation-timing-function: linear; iteration-count: infinite; }

                @keyframes draw-graph {
                    0% { stroke-dasharray: 0 2000; }
                    50% { stroke-dasharray: 2000 0; opacity: 1; }
                    100% { stroke-dasharray: 2000 0; opacity: 0; transform: translateX(100px); }
                }
                .animate-draw-graph { animation: draw-graph 3s ease-out infinite; }
                
                @keyframes draw-graph-slow {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-draw-graph-slow { animation: draw-graph-slow 8s linear infinite; }

                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(100%) skewX(-15deg); }
                }
                .animate-shine { animation: shine 0.5s linear; }

                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }

                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .animate-glitch { animation: glitch 0.2s linear infinite; }
                
                @keyframes warp-speed {
                     from { background-position: 0 0; }
                     to { background-position: 0 1000px; }
                }
                .animate-warp-speed { animation: warp-speed 20s linear infinite; }
            `}</style>
        </div>
    )
  }

  // --- STANDARD GAME HUD ---
  return (
    <div className="absolute top-4 left-4 z-10 pointer-events-none w-full max-w-md">
      {/* Header Logo */}
      <div className="flex items-center justify-between mb-4 pr-4">
         <div className="flex items-center gap-2 p-2 bg-gray-900/40 backdrop-blur-md border border-green-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
             <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]"></div>
             <h1 className="text-xl font-bold font-mono text-white tracking-wider drop-shadow-md">
                GIT<span className="text-green-400">KRAKEN</span>
             </h1>
         </div>
         <div className="flex gap-2">
            <button 
                onClick={toggleMute}
                className="pointer-events-auto p-2 bg-gray-900/60 backdrop-blur-md rounded-lg border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-300 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            >
                {isMuted ? '🔇' : '🔊'}
            </button>
            <button 
                onClick={onExit}
                className="pointer-events-auto p-2 bg-red-900/60 backdrop-blur-md rounded-lg border border-red-500/50 hover:bg-red-900/50 text-red-300 transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)] font-mono text-xs"
            >
                EXIT
            </button>
         </div>
      </div>

      {/* Tutorial / Mission Control Panel */}
      <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-lg mb-4 text-white pointer-events-auto transition-all duration-500 hover:translate-x-1 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]">
         <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
            <h2 className="text-xs font-bold font-mono text-yellow-400 uppercase tracking-widest glow-text-yellow">Mission Control</h2>
            <span className="text-[10px] bg-yellow-400/20 text-yellow-200 px-2 py-0.5 rounded border border-yellow-400/50">Lvl {state.level}</span>
         </div>
         <p className="text-sm font-bold leading-tight mb-2 text-shadow-sm">{state.activeObjective}</p>
      </div>

      {/* Stats Panel */}
      <div className="flex gap-4">
        <div className="bg-gray-900/60 border border-cyan-500/40 p-3 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md text-white flex-1">
             <div className="text-[10px] text-cyan-400 uppercase mb-1 tracking-wider">Current Branch</div>
             <div className="font-mono font-bold text-sm truncate text-cyan-100 shadow-cyan-500/50">{state.currentBranch}</div>
        </div>
        
        <div className="bg-gray-900/60 border border-orange-500/40 p-3 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.15)] backdrop-blur-md text-white flex-1">
             <div className="text-[10px] text-orange-400 uppercase mb-1 tracking-wider">Staged Changes</div>
             <div className="font-mono font-bold text-sm text-orange-100">{state.inventory.length} Files</div>
        </div>
      </div>

      {/* MINIGAME OVERLAY */}
      {state.minigame.isActive && (
         <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
             <div className="absolute inset-0 bg-red-900/50 backdrop-blur-md animate-pulse"></div>
             <div className="bg-gray-900 border-4 border-red-500 p-8 rounded-xl shadow-[0_0_50px_red] relative w-[500px] transform scale-110">
                 <h2 className="text-3xl text-red-500 font-black text-center mb-4 animate-bounce text-shadow-neon">MERGE CONFLICT</h2>
                 <p className="text-white text-center mb-6 font-mono">Timeline collapse imminent!</p>
                 
                 {/* Timer */}
                 <div className="w-full bg-gray-800 h-4 rounded-full mb-8 overflow-hidden border border-gray-600 shadow-inner">
                     <div 
                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-100 ease-linear"
                        style={{ width: `${(state.minigame.timeLeft / state.minigame.maxTime) * 100}%` }}
                     ></div>
                 </div>

                 {/* Arrows */}
                 <div className="flex justify-center gap-4 mb-4">
                     {state.minigame.sequence.map((key, idx) => {
                         const isDone = idx < state.minigame.currentIndex;
                         const isCurrent = idx === state.minigame.currentIndex;
                         return (
                             <div 
                                key={idx}
                                className={`
                                    w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-bold border-2 transition-all duration-200
                                    ${isDone ? 'bg-green-500 border-green-400 text-white shadow-[0_0_10px_green]' : 
                                      isCurrent ? 'bg-yellow-500 border-yellow-400 text-black animate-bounce shadow-[0_0_15px_yellow] scale-110' : 
                                      'bg-gray-800 border-gray-600 text-gray-600'}
                                `}
                             >
                                 {renderArrow(key)}
                             </div>
                         )
                     })}
                 </div>
             </div>
         </div>
      )}
      
      {/* Win Modal */}
      {state.status === 'WON' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 pointer-events-auto backdrop-blur-md">
            <div className="bg-gray-900 p-8 rounded-2xl border-2 border-green-500 text-center shadow-[0_0_50px_green] max-w-lg mx-4 transform scale-100 animate-bounce-slight">
                <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_green] animate-pulse">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 mb-2 font-mono">SUCCESS!</h1>
                <div className="bg-black/50 border border-green-500/30 p-4 rounded text-left font-mono text-sm text-green-400 mb-6 overflow-hidden shadow-inner">
                    {state.level === 1 ? '$ git push origin main' : '$ git push origin main --force-with-lease'}
                </div>
                <p className="text-gray-300 mb-6">
                    {state.level === 1 && "Bridge fixed and deployed."}
                    {state.level === 2 && "Bad commit reverted. Production saved."}
                    {state.level === 3 && "Cherry-picked the fix. Skipped the bugs!"}
                    {state.level === 4 && "Rebase complete. History is clean."}
                </p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg font-bold transition shadow-lg"
                    >
                        Replay
                    </button>
                    {state.level < 4 ? (
                        <button 
                            onClick={onNextLevel}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white rounded-lg font-bold transition shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            Next Level ➜
                        </button>
                    ) : (
                         <button 
                            onClick={onExit}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold transition shadow-lg"
                        >
                            Back to Map
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
      
      <style>{`
        .glow-text-yellow { text-shadow: 0 0 5px rgba(250,204,21, 0.5); }
        .text-shadow-neon { text-shadow: 0 0 10px rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};
