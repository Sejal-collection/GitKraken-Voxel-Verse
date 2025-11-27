
import React, { useEffect } from 'react';
import { GameScene } from './components/VoxelEngine';
import { Terminal } from './components/Terminal';
import { GameUI } from './components/GameUI';
import { LevelMap } from './components/LevelMap';
import { KnowledgeBase } from './components/KnowledgeBase';
import { GitGraph } from './components/GitGraph';
import { useGameLogic } from './hooks/useGameLogic';

const App: React.FC = () => {
  const { 
    gameState, 
    levelConfig, 
    playerPos, 
    processCommand, 
    interactWithEntity, 
    handleMinigameInput, 
    log, 
    loadLevel, 
    sound, 
    startGame, 
    openKnowledgeBase, 
    closeKnowledgeBase,
    exitGame
  } = useGameLogic();

  // Start Background Music on Interaction
  useEffect(() => {
     const startAudio = () => {
         sound.playMusic();
         // We remove listeners so it doesn't try to restart constantly
         window.removeEventListener('click', startAudio);
         window.removeEventListener('keydown', startAudio);
     };
     
     // Browsers require user interaction before playing audio
     window.addEventListener('click', startAudio);
     window.addEventListener('keydown', startAudio);
     
     return () => {
         window.removeEventListener('click', startAudio);
         window.removeEventListener('keydown', startAudio);
         // Note: We DO NOT stop music here to allow it to persist through re-renders
         // sound.stopMusic(); 
     };
  }, []); // Empty dependency array ensures this only runs once on mount

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        
        if (gameState.minigame.isActive) {
             if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                 e.preventDefault();
                 handleMinigameInput(e.key);
             }
             return;
        }

        // Only trigger move if not focused on an input
        if (document.activeElement?.tagName !== 'INPUT') {
             if(e.key === 'w' || e.key === 'ArrowUp') processCommand('move w');
             if(e.key === 's' || e.key === 'ArrowDown') processCommand('move s');
             if(e.key === 'a' || e.key === 'ArrowLeft') processCommand('move a');
             if(e.key === 'd' || e.key === 'ArrowRight') processCommand('move d');
             if(e.key === 'q') processCommand('rotate left'); // Allow rotation via keys if needed, though mouse is preferred
             if(e.key === 'e') processCommand('rotate right');
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processCommand, gameState.minigame.isActive, handleMinigameInput]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#02040a] overflow-hidden font-sans text-gray-100">
      
      {/* 1. KNOWLEDGE BASE */}
      {gameState.status === 'KNOWLEDGE_BASE' && (
         <div className="absolute inset-0 z-40">
            <KnowledgeBase onBack={closeKnowledgeBase} />
         </div>
      )}

      {/* 2. LEVEL MAP */}
      {gameState.status === 'MAP' && (
         <div className="absolute inset-0 z-30">
            <LevelMap 
                progress={gameState.levelProgress} 
                onSelectLevel={loadLevel} 
                onOpenKnowledgeBase={openKnowledgeBase}
            />
         </div>
      )}
      
      {/* 3. GAMEPLAY SCENE */}
      
      {/* LEFT COLUMN: 3D WORLD (60-70% Width) */}
      <div className="relative flex-1 h-[60vh] md:h-full overflow-hidden perspective-container">
        
        {/* --- DYNAMIC 3D BACKGROUND --- */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]"></div>
        
        {/* Hyperspace Stars */}
        <div className="absolute inset-0 z-0 opacity-60">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse-slow"></div>
             <div className="absolute inset-0 animate-stars-move-slow opacity-80" style={{ background: 'radial-gradient(1px 1px at 10% 10%, white, transparent), radial-gradient(1px 1px at 20% 20%, white, transparent)' }}></div>
        </div>

        {/* 3D Cyber Grid Floor */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-end justify-center">
             <div 
                className="w-[200vw] h-[100vh] bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] origin-bottom animate-grid-flow"
                style={{ transform: 'perspective(500px) rotateX(60deg) translateY(0)' }}
             ></div>
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/20 to-transparent"></div>
        </div>

        {/* UI Overlays */}
        <GameUI 
            state={gameState} 
            onNextLevel={() => loadLevel(gameState.level + 1)}
            toggleMute={sound.toggleMute}
            isMuted={sound.isMuted}
            startGame={startGame}
            onExit={exitGame}
        />
        
        {/* 3D World */}
        {(gameState.status === 'PLAYING' || gameState.status === 'INTRO' || gameState.status === 'WON' || gameState.status === 'LOST') && (
            <GameScene 
                entities={levelConfig.entities} 
                playerPos={playerPos} 
                tutorialTarget={gameState.status === 'PLAYING' ? gameState.tutorialTarget : undefined}
                shakeIntensity={gameState.shakeIntensity}
                particles={gameState.particles}
                onInteract={interactWithEntity}
            />
        )}
        
        {/* Helper */}
        {gameState.status === 'PLAYING' && (
            <div className="absolute bottom-4 left-4 text-cyan-500/40 text-xs font-mono hidden md:block pointer-events-none select-none z-10">
            [WASD] Move &nbsp; [MOUSE] Rotate & Zoom &nbsp; [TERM] Command &nbsp; [R-CLICK] Interact
            </div>
        )}
      </div>

      {/* RIGHT COLUMN: DASHBOARD (30-40% Width) - Only visible after Intro */}
      {gameState.status !== 'INTRO' && (
        <div className="h-[40vh] md:h-full md:w-[450px] flex-shrink-0 z-20 shadow-2xl border-l border-cyan-900/30 flex flex-col bg-[#0d1117]">
            {/* TOP: GIT GRAPH */}
            <div className="h-1/3 border-b border-[#30363d]">
                <GitGraph state={gameState} />
            </div>

            {/* BOTTOM: TERMINAL */}
            <div className="h-2/3">
                <Terminal 
                    onCommand={processCommand} 
                    history={log} 
                    currentBranch={gameState.currentBranch}
                />
            </div>
        </div>
      )}
      
      <style>{`
        @keyframes grid-flow {
            0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
            100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }
        .animate-grid-flow {
            animation: grid-flow 2s linear infinite;
        }
        @keyframes stars-move-slow {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
        }
        .animate-stars-move-slow {
            animation: stars-move-slow 60s linear infinite;
        }
        .perspective-container {
            perspective: 1200px;
        }
      `}</style>

    </div>
  );
};

export default App;
