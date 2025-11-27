
import React from 'react';
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
  const renderArrow = (key: string) => {
      switch(key) {
          case 'ArrowUp': return '↑';
          case 'ArrowDown': return '↓';
          case 'ArrowLeft': return '←';
          case 'ArrowRight': return '→';
          default: return '?';
      }
  };

  // Intro Screen
  if (state.status === 'INTRO') {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-mono bg-[#020617]/70 backdrop-blur-[2px]">
            {/* Holographic Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
            <div className="absolute top-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_20px_cyan] animate-scan-line"></div>
            
            <div className="absolute top-20 left-20 w-16 h-16 border border-cyan-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-40 right-20 w-24 h-24 border border-purple-500/20 rotate-45 animate-pulse-slow"></div>

            <div className="relative z-10 text-center pointer-events-auto transform hover:scale-105 transition-transform duration-700">
                <div className="mb-12 relative group perspective-1000">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full animate-pulse-slow"></div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-400/30 rounded-full animate-spin-reverse-slow"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-t border-b border-purple-400/50 rounded-full animate-spin-slow"></div>

                  <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-float transform-style-3d [transform:rotateX(12deg)]">
                       <svg className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_10px_cyan]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  </div>
                </div>
                
                <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 mb-0 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] tracking-tighter">
                    GITKRAKEN
                </h1>
                <h2 className="text-4xl font-bold text-white tracking-[0.8em] mb-16 text-shadow-neon uppercase opacity-90 relative">
                    Voxel Verse
                    <span className="absolute -bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></span>
                </h2>

                <button 
                  onClick={startGame}
                  className="group relative px-12 py-6 bg-transparent overflow-hidden rounded-sm transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-cyan-950/80 skew-x-[-20deg] border border-cyan-500/50 group-hover:bg-cyan-900 transition-colors shadow-[0_0_30px_rgba(6,182,212,0.2)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[-20deg]"></div>
                    
                    <span className="relative z-10 text-2xl font-bold text-cyan-100 group-hover:text-white tracking-widest flex items-center justify-center gap-4">
                        <span className="animate-pulse">►</span> INITIALIZE SYSTEM
                    </span>
                    
                    <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400"></div>
                </button>
                
                <p className="mt-12 text-cyan-600/60 font-mono text-xs animate-pulse tracking-widest">
                    // WAITING_FOR_INPUT... <br/>
                    // RENDER_ENGINE: ACTIVE
                </p>
            </div>
            
            <style>{`
                @keyframes scan-line {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 4s linear infinite;
                }
                @keyframes spin-reverse-slow {
                    from { transform: translate(-50%, -50%) rotate(360deg); }
                    to { transform: translate(-50%, -50%) rotate(0deg); }
                }
                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 15s linear infinite;
                }
            `}</style>
        </div>
    )
  }

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
