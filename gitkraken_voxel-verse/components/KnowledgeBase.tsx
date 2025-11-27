
import React from 'react';
import { GIT_COMMAND_DATA } from '../constants';

interface KnowledgeBaseProps {
  onBack: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onBack }) => {
  
  // Group commands by category with enhanced visual configs
  const categories = {
      'CORE': { title: 'Essential Protocols', color: 'from-cyan-400 to-blue-600', icon: '⚡' },
      'BRANCHING': { title: 'Timeline Manipulation', color: 'from-fuchsia-400 to-purple-600', icon: 'ᛘ' }, 
      'GITHUB': { title: 'Interstellar Uplink', color: 'from-orange-400 to-red-600', icon: '☁' },
      'ADVANCED': { title: 'Quantum Mechanics', color: 'from-emerald-400 to-teal-600', icon: '⌬' }
  };

  const groupedData = GIT_COMMAND_DATA.reduce((acc, item) => {
      const cat = item.category || 'CORE';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
  }, {} as Record<string, typeof GIT_COMMAND_DATA>);

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-y-auto custom-scrollbar overflow-x-hidden perspective-1000">
       
       {/* --- DYNAMIC GALAXY BACKGROUND --- */}
       
       <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep Space Base */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1b4b] via-[#0f0c29] to-[#000000]"></div>

            {/* Galaxy Spin Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] opacity-30 animate-spin-very-slow">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,via-purple-900/40_90deg,transparent_180deg,via-blue-900/40_270deg,transparent_360deg)] blur-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(124,58,237,0.1)_50%,transparent_70%)]"></div>
            </div>

            {/* Vibrant Nebulae (Matches Level Map Colors) */}
            <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000"></div>
            <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-2000"></div>

            {/* Stars Layer */}
            <div className="absolute inset-0">
                 <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-twinkle shadow-[0_0_4px_white]"></div>
                 <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-cyan-200 rounded-full animate-twinkle delay-700 shadow-[0_0_4px_cyan]"></div>
                 <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-purple-200 rounded-full animate-twinkle delay-300 shadow-[0_0_4px_purple]"></div>
                 <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-twinkle delay-500"></div>
                 <div className="absolute bottom-10 right-20 w-1 h-1 bg-yellow-100 rounded-full animate-twinkle delay-1000"></div>
                 {/* Texture */}
                 <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            </div>
       </div>

       {/* Header Bar Gradient */}
       <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent z-20 pointer-events-none"></div>
       
       {/* --- MAIN CONTENT --- */}
       <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
           
           {/* Navigation & Title */}
           <div className="flex flex-col md:flex-row items-center justify-between mb-20 mt-6 relative">
               <div className="text-center md:text-left z-10">
                   <div className="inline-block mb-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md">
                       <span className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase animate-pulse">System: Archive</span>
                   </div>
                   <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-fuchsia-400 mb-4 font-sans tracking-tighter drop-shadow-[0_0_25px_rgba(192,132,252,0.3)]">
                       GIT_NEXUS
                   </h1>
                   <p className="text-blue-200/60 font-mono text-sm max-w-md leading-relaxed">
                       ACCESSING NEURAL NETWORK... <br/>
                       DECRYPTING COMMAND PROTOCOLS...
                   </p>
               </div>

               <button 
                  onClick={onBack}
                  className="mt-8 md:mt-0 group relative px-8 py-4 bg-transparent overflow-hidden rounded-none skew-x-[-10deg] border-2 border-cyan-500/30 hover:border-cyan-400 transition-colors"
               >
                  <div className="absolute inset-0 w-full h-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors"></div>
                  {/* Glitch lines */}
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-[20deg] group-hover:animate-shine"></div>
                  
                  <div className="skew-x-[10deg] flex items-center gap-3 text-cyan-100 font-bold tracking-widest text-sm">
                      <span className="text-xl">«</span> ABORT SEQUENCE
                  </div>
               </button>
           </div>

           {/* Content Grid */}
           <div className="space-y-24">
               {Object.entries(categories).map(([key, config]) => (
                   <div key={key} className="relative">
                       {/* Category Header */}
                       <div className="flex items-end gap-4 mb-10 border-b border-white/5 pb-4 relative">
                           <div className={`absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r ${config.color}`}></div>
                           <span className="text-5xl opacity-80 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{config.icon}</span>
                           <div>
                               <h2 className={`text-3xl font-bold text-white tracking-wide`}>
                                   {config.title}
                               </h2>
                               <span className={`text-xs font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.color} tracking-[0.2em]`}>
                                   // SECTION: {key}
                               </span>
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-800">
                           {groupedData[key]?.map((item, idx) => (
                               <div 
                                    key={idx} 
                                    className="group relative h-full bg-slate-900/30 backdrop-blur-sm border border-white/10 p-1 rounded-2xl transition-all duration-500 hover:transform hover:-translate-y-2 hover:scale-[1.02] hover:z-20 hover:border-white/20 hover:bg-slate-800/50"
                               >
                                   {/* Glow Border Effect */}
                                   <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500 -z-10`}></div>
                                   
                                   {/* Inner Card */}
                                   <div className="h-full bg-[#0B1120]/80 rounded-xl p-6 overflow-hidden relative">
                                       
                                       {/* Cyber Lines BG */}
                                       <div className="absolute inset-0 opacity-10 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>

                                       <div className="relative z-10">
                                            {/* Command Header */}
                                            <div className="mb-4">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} shadow-lg mb-3 text-white font-bold`}>
                                                    {idx + 1}
                                                </div>
                                                <h3 className="text-xl font-bold text-white font-mono break-words group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                                    {item.cmd}
                                                </h3>
                                            </div>
                                            
                                            {/* Divider */}
                                            <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-white/50 group-hover:to-transparent transition-colors"></div>

                                            {/* Description */}
                                            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                                                {item.desc}
                                            </p>
                                       </div>
                                       
                                       {/* Corner Accents */}
                                       <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               ))}
           </div>
       </div>

       <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }

          @keyframes spin-very-slow {
              from { transform: translate(-50%, -50%) rotate(0deg); }
              to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          .animate-spin-very-slow {
              animation: spin-very-slow 60s linear infinite;
          }
          
          @keyframes shine {
              0% { left: -100%; }
              100% { left: 200%; }
          }
          .animate-shine {
              animation: shine 1s;
          }
          
          @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.2); }
          }
          .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
          
          @keyframes pulse-slow {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.3; }
          }
          .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
       `}</style>
    </div>
  );
};
