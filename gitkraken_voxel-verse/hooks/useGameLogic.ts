
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LevelConfig, EntityType, Vector3, VoxelEntity, Particle, MinigameState, LevelProgress } from '../types';
import { LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, COLORS } from '../constants';
import { useSound } from './useSound';

export const useGameLogic = () => {
  const sound = useSound();
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(LEVEL_1);
  const [playerPos, setPlayerPos] = useState<Vector3>(LEVEL_1.startPos);
  
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    currentBranch: 'main',
    branches: ['main'],
    inventory: [],
    commits: [], 
    status: 'INTRO', 
    message: "Welcome to the repo! Use 'w', 'a', 's', 'd' to move Keif around.",
    tutorialStep: 0,
    activeObjective: "Move Keif closer to the gap on the right.",
    tutorialTarget: { x: 2, y: 1, z: 1 },
    shakeIntensity: 0,
    particles: [],
    minigame: { isActive: false, sequence: [], currentIndex: 0, timeLeft: 0, maxTime: 0 },
    levelProgress: [
        { levelId: 1, unlocked: true, stars: 0 },
        { levelId: 2, unlocked: false, stars: 0 },
        { levelId: 3, unlocked: false, stars: 0 },
        { levelId: 4, unlocked: false, stars: 0 }
    ]
  });

  const [log, setLog] = useState<string[]>([
      "Welcome to GitKraken Voxel Verse.",
      "Initializing repository...",
      "Repo loaded.",
      "Type <span class='text-cyan-300'>help</span> for commands."
  ]);

  const startGame = () => {
      sound.playObjectiveComplete(); 
      setGameState(prev => ({ ...prev, status: 'MAP' }));
  };

  const openKnowledgeBase = () => {
      setGameState(prev => ({ ...prev, status: 'KNOWLEDGE_BASE' }));
  };
  
  const closeKnowledgeBase = () => {
      setGameState(prev => ({ ...prev, status: 'MAP' }));
  };

  const exitGame = () => {
      setGameState(prev => ({ ...prev, status: 'MAP' }));
  };

  // Minigame Timer Loop
  useEffect(() => {
    if (!gameState.minigame.isActive) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev.minigame.isActive) return prev;
        const newTime = prev.minigame.timeLeft - 0.1; 
        
        if (newTime <= 0) {
          sound.playCommandError();
          return {
            ...prev,
            shakeIntensity: 1,
            minigame: { ...prev.minigame, isActive: false },
            message: "Merge Conflict Resolution Failed! Try again."
          };
        }
        return { ...prev, minigame: { ...prev.minigame, timeLeft: newTime } };
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState.minigame.isActive, sound]);

  // Particle System
  useEffect(() => {
    let frameId: number;
    const updateParticles = () => {
        setGameState(prev => {
            if (prev.particles.length === 0 && prev.shakeIntensity <= 0.01) return prev;

            const newShake = Math.max(0, prev.shakeIntensity * 0.9);

            const newParticles = prev.particles.map(p => ({
                ...p,
                x: p.x + p.velocity.x,
                y: p.y + p.velocity.y,
                z: p.z + p.velocity.z,
                life: p.life - 0.05,
                velocity: {
                    x: p.velocity.x,
                    y: p.velocity.y,
                    z: p.velocity.z - 0.02 
                }
            })).filter(p => p.life > 0);

            return { ...prev, particles: newParticles, shakeIntensity: newShake };
        });
        frameId = requestAnimationFrame(updateParticles);
    };
    frameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const spawnParticles = (x: number, y: number, z: number, color: string, count: number = 10) => {
      const newParticles: Particle[] = [];
      for(let i=0; i<count; i++) {
          newParticles.push({
              id: Math.random().toString(),
              x, y, z,
              color,
              life: 1.0,
              velocity: {
                  x: (Math.random() - 0.5) * 0.2,
                  y: (Math.random() - 0.5) * 0.2,
                  z: Math.random() * 0.3
              }
          });
      }
      setGameState(prev => ({ ...prev, particles: [...prev.particles, ...newParticles] }));
  };

  const triggerShake = (intensity: number = 1) => {
      setGameState(prev => ({ ...prev, shakeIntensity: intensity }));
  };

  const loadLevel = (levelId: number) => {
      let config = LEVEL_1;
      if (levelId === 2) config = LEVEL_2;
      if (levelId === 3) config = LEVEL_3;
      if (levelId === 4) config = LEVEL_4;

      setCurrentLevelId(levelId);
      setLevelConfig(config);
      setPlayerPos(config.startPos);
      setLog([`--- LOADED LEVEL ${levelId}: ${config.name} ---`, config.description]);

      const baseState: Partial<GameState> = {
          status: 'PLAYING',
          message: config.description,
          shakeIntensity: 0,
          particles: [],
          minigame: { isActive: false, sequence: [], currentIndex: 0, timeLeft: 0, maxTime: 0 }
      };

      if (levelId === 1) {
        setGameState(prev => ({
            ...prev,
            ...baseState,
            level: 1,
            currentBranch: 'main',
            branches: ['main'],
            inventory: [],
            commits: [],
            tutorialStep: 0,
            activeObjective: "Move Keif closer to the gap on the right.",
            tutorialTarget: { x: 2, y: 1, z: 1 },
        }));
      } else if (levelId === 2) {
        setGameState(prev => ({
            ...prev,
            ...baseState,
            level: 2,
            currentBranch: 'main',
            branches: ['main'],
            inventory: [],
            commits: ['init', 'feat-ui', 'bad123'], 
            tutorialStep: 0,
            activeObjective: "A bug is blocking the path! Move closer to investigate.",
            tutorialTarget: { x: 3, y: 1, z: 2 },
        }));
      } else if (levelId === 3) {
          setGameState(prev => ({
            ...prev,
            ...baseState,
            level: 3,
            currentBranch: 'main',
            branches: ['main', 'feature'],
            inventory: [],
            commits: ['init'],
            tutorialStep: 0,
            activeObjective: "You need that GOLD block from the feature branch. Type 'git log'.",
            tutorialTarget: undefined,
          }));
      } else if (levelId === 4) {
          setGameState(prev => ({
              ...prev,
              ...baseState,
              level: 4,
              currentBranch: 'feature-messy',
              branches: ['main', 'feature-messy'],
              commits: ['init', 'C1', 'C2', 'C3'],
              tutorialStep: 0,
              activeObjective: "The commits are physically scattered. Type 'git rebase -i' to start fixing.",
              tutorialTarget: undefined
          }));
      }
  };

  const addLog = (msg: string) => {
    setLog(prev => [...prev, msg]);
  };

  const startMinigame = (onSuccess: () => void) => {
      const sequence = [];
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      for(let i=0; i<6; i++) {
          sequence.push(keys[Math.floor(Math.random() * keys.length)]);
      }

      setGameState(prev => ({
          ...prev,
          minigame: {
              isActive: true,
              sequence,
              currentIndex: 0,
              timeLeft: 5.0,
              maxTime: 5.0,
              onSuccess
          }
      }));
      sound.playCommandError();
  };

  const handleMinigameInput = (key: string) => {
      if (!gameState.minigame.isActive) return;

      const expected = gameState.minigame.sequence[gameState.minigame.currentIndex];
      
      if (key === expected) {
          sound.playStep();
          const nextIndex = gameState.minigame.currentIndex + 1;
          
          if (nextIndex >= gameState.minigame.sequence.length) {
              setGameState(prev => ({
                  ...prev,
                  minigame: { ...prev.minigame, isActive: false }
              }));
              gameState.minigame.onSuccess?.();
          } else {
              setGameState(prev => ({
                  ...prev,
                  minigame: { ...prev.minigame, currentIndex: nextIndex }
              }));
          }
      } else {
          sound.playCommandError();
          triggerShake(0.2);
      }
  };


  // --- TUTORIAL SYSTEM ---
  const updateTutorialState = (level: number, currentStep: number, actionType: 'MOVE' | 'COMMAND', payload: any): Partial<GameState> | null => {
       if (level === 1) {
        if (currentStep === 0 && actionType === 'MOVE') {
            const pos = payload as Vector3;
            if (pos.x === 2 && pos.y === 1) {
                addLog("Warning: Gap detected. The main branch is broken.");
                sound.playObjectiveComplete();
                return {
                    tutorialStep: 1,
                    activeObjective: "Inspect the repository status. Type 'git status'.",
                    tutorialTarget: undefined
                };
            }
        }
        if (currentStep === 1 && actionType === 'COMMAND' && payload === 'status') {
            sound.playObjectiveComplete();
            return {
                tutorialStep: 2,
                activeObjective: "Create a new branch to fix the bridge. Type 'git checkout -b fix-bridge'.",
                tutorialTarget: undefined
            };
        }
        if (currentStep === 2 && actionType === 'COMMAND' && payload.cmd === 'checkout' && payload.arg === '-b') {
             sound.playObjectiveComplete();
             return {
                tutorialStep: 3,
                activeObjective: "A wild path appeared! Move to the orange resource block.",
                tutorialTarget: { x: 2, y: 5, z: 1 }
             };
        }
        if (currentStep === 3 && actionType === 'MOVE') {
            const pos = payload as Vector3;
            if (pos.x === 2 && pos.y === 5) {
                sound.playObjectiveComplete();
                return {
                    tutorialStep: 4,
                    activeObjective: "You found the fix! Stage it with 'git add .'",
                    tutorialTarget: { x: 2, y: 5, z: 2 } 
                };
            }
        }
        if (currentStep === 4 && actionType === 'COMMAND' && payload === 'add') {
            sound.playObjectiveComplete();
            return {
                tutorialStep: 5,
                activeObjective: "Great! Now save your changes. Type 'git commit -m \"fix bridge\"'.",
                tutorialTarget: undefined
            };
        }
        if (currentStep === 5 && actionType === 'COMMAND' && payload === 'commit') {
            sound.playObjectiveComplete();
            return {
                tutorialStep: 6,
                activeObjective: "Saved. Switch back to main to merge. Type 'git checkout main'.",
                tutorialTarget: undefined
            };
        }
        if (currentStep === 6 && actionType === 'COMMAND' && payload.cmd === 'checkout' && payload.arg !== '-b') {
            sound.playObjectiveComplete();
            return {
                tutorialStep: 7,
                activeObjective: "Now merge your fix into main. Type 'git merge fix-bridge'.",
                tutorialTarget: { x: 3, y: 1, z: 0 } 
            };
        }
        if (currentStep === 7 && actionType === 'COMMAND' && payload === 'merge') {
             sound.playObjectiveComplete();
             return {
                tutorialStep: 8,
                activeObjective: "Conflict resolved! Cross the bridge to the Golden Head.",
                tutorialTarget: { x: 5, y: 1, z: 1 }
             };
        }
      }
      if (level === 2) {
          if (currentStep === 0 && actionType === 'MOVE') {
             const pos = payload as Vector3;
             if (pos.x === 2 && pos.y === 1) { 
                 addLog("It's a solid bug! We can't pass.");
                 sound.playObjectiveComplete();
                 triggerShake(0.5);
                 return {
                     tutorialStep: 1,
                     activeObjective: "Find the bad commit hash. Type 'git log'.",
                     tutorialTarget: undefined
                 };
             }
          }
          if (currentStep === 1 && actionType === 'COMMAND' && payload === 'log') {
              sound.playObjectiveComplete();
              return {
                  tutorialStep: 2,
                  activeObjective: "The bad commit is 'bad123'. Undo it! Type 'git revert bad123'.",
                  tutorialTarget: { x: 3, y: 1, z: 2 }
              };
          }
          if (currentStep === 2 && actionType === 'COMMAND' && payload === 'revert') {
              sound.playObjectiveComplete();
              return {
                  tutorialStep: 3,
                  activeObjective: "Bug squashed! Head to the PROD flag.",
                  tutorialTarget: { x: 6, y: 1, z: 1 }
              };
          }
      }
      if (level === 3) {
          if (currentStep === 0 && actionType === 'COMMAND' && payload === 'log') {
              sound.playObjectiveComplete();
              return {
                  tutorialStep: 1,
                  activeObjective: "The block 'a1b2c3' is perfect. But merging brings bugs. Type 'git cherry-pick a1b2c3'.",
                  tutorialTarget: { x: 3, y: 4, z: 2 } 
              }
          }
          if (currentStep === 1 && actionType === 'COMMAND' && payload === 'cherry-pick') {
               sound.playObjectiveComplete();
               return {
                   tutorialStep: 2,
                   activeObjective: "Nice pick! The block has been moved. Use WASD to walk to the 'RELEASE' flag!",
                   tutorialTarget: { x: 5, y: 1, z: 1 }
               }
          }
      }
      if (level === 4) {
          if (currentStep === 0 && actionType === 'COMMAND' && payload === 'rebase') {
              sound.playObjectiveComplete();
              return {
                  tutorialStep: 1,
                  activeObjective: "Interactive Rebase Mode! Type 'swap c1 slot1' to reorder the blocks into the slots.",
                  tutorialTarget: undefined
              }
          }
          if (currentStep === 1 && actionType === 'COMMAND' && payload === 'swap') {
               // Check if completed
               const c1 = levelConfig.entities.find(e => e.label === 'C1');
               const c2 = levelConfig.entities.find(e => e.label === 'C2');
               // Slots are at y=1
               if (c1?.position.y === 1 && c2?.position.y === 1) {
                    sound.playObjectiveComplete();
                    return {
                        tutorialStep: 2,
                        activeObjective: "History rewritten! The bridge is aligned. Walk to the goal.",
                        tutorialTarget: { x: 5, y: 1, z: 1 }
                    }
               }
          }
      }

      return null;
  };

  const checkMove = (targetPos: Vector3): boolean => {
    if (targetPos.z < 0) return false;

    const entityAtPos = levelConfig.entities.find(e => 
      e.position.x === targetPos.x && 
      e.position.y === targetPos.y && 
      e.position.z === targetPos.z &&
      !e.isHidden
    );

    if (entityAtPos?.type === EntityType.Obstacle) {
      addLog(`<span class='text-red-400'>FATAL: Path blocked by ${entityAtPos.label || 'Obstacle'}! Resolve it first.</span>`);
      sound.playCommandError();
      triggerShake(0.5);
      return false;
    }

    const groundBelow = levelConfig.entities.find(e => 
      e.position.x === targetPos.x && 
      e.position.y === targetPos.y && 
      e.position.z === targetPos.z - 1 &&
      !e.isHidden && e.type !== EntityType.Decoration
    );
    
    // In Level 3, the bridge might be missing
    if (gameState.level === 3 && targetPos.x === 3 && targetPos.y === 1 && !groundBelow) {
        addLog("<span class='text-yellow-400'>Gap detected! You need to 'cherry-pick' a block from another branch to bridge this.</span>");
        sound.playCommandError();
        return false;
    }
    
    if (!groundBelow && targetPos.z > 0) {
       addLog("Watch out! The branch ends here.");
       return false;
    }

    return true;
  };

  const movePlayer = (dx: number, dy: number) => {
    if (gameState.status !== 'PLAYING' || gameState.minigame.isActive) return;
    
    const newPos = { ...playerPos, x: playerPos.x + dx, y: playerPos.y + dy };
    
    if (checkMove(newPos)) {
      setPlayerPos(newPos);
      sound.playStep();

      const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'MOVE', newPos);
      if (tutorialUpdate) {
          setGameState(prev => ({ ...prev, ...tutorialUpdate }));
      }
      
      const goal = levelConfig.entities.find(e => e.type === EntityType.Goal);
      if (goal && newPos.x === goal.position.x && newPos.y === goal.position.y) {
        sound.playWin();
        spawnParticles(newPos.x, newPos.y, newPos.z + 1, COLORS.GIT_ORANGE, 30);
        
        setGameState(prev => {
            const nextLevel = prev.level + 1;
            const updatedProgress = prev.levelProgress.map(lp => {
                if (lp.levelId === prev.level) return { ...lp, stars: 3 }; 
                if (lp.levelId === nextLevel) return { ...lp, unlocked: true }; 
                return lp;
            });
            return { 
                ...prev, 
                status: 'WON', 
                activeObjective: "Level Complete!", 
                tutorialTarget: undefined,
                levelProgress: updatedProgress
            };
        });
        addLog("HEAD reached. Deployment successful.");
      }
    }
  };

  const interactWithEntity = (id: string) => {
    if (gameState.status !== 'PLAYING') return;
    
    const entity = levelConfig.entities.find(e => e.id === id);
    if (!entity) return;
    
    const dx = Math.abs(entity.position.x - playerPos.x);
    const dy = Math.abs(entity.position.y - playerPos.y);
    const dz = Math.abs(entity.position.z - playerPos.z);
    
    if (dx + dy + dz > 2.5) { 
         addLog(`<span class='text-gray-500'>Target too far to interact. Move closer.</span>`);
         sound.playCommandError();
         return;
    }

    if (entity.type === EntityType.Resource && !entity.isHidden) {
        setGameState(prev => ({ ...prev, inventory: [...prev.inventory, entity.label || 'file'] }));
        setLevelConfig(prev => ({
             ...prev,
             entities: prev.entities.map(e => e.id === entity.id ? { ...e, isHidden: true } : e)
        }));
        spawnParticles(entity.position.x, entity.position.y, entity.position.z + 1, COLORS.GIT_ORANGE, 10);
        addLog(`> git add ${entity.label}`);
        addLog("Changes staged for commit.");
        sound.playCommandSuccess();
        
        const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'add');
        if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));

    } else if (entity.type === EntityType.Obstacle) {
        addLog(`> Inspecting Obstacle: ${entity.label}`);
        if (gameState.level === 1) addLog("Hint: You need to merge the fix.");
        if (gameState.level === 2) addLog("Hint: A bad commit caused this. Use git log.");
    } else if (entity.label) {
        addLog(`> Inspecting: ${entity.label}`);
    }
  };

  const processCommand = (cmdStr: string) => {
    if (gameState.minigame.isActive) return;

    const raw = cmdStr.trim();
    addLog(`> ${raw}`);
    
    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const subCmd = parts[1] ? parts[1].toLowerCase() : '';
    const arg = parts[2] ? parts[2] : '';

    if (cmd === 'help' || (cmd === 'git' && subCmd === 'help') || (cmd === 'git' && subCmd === '--help')) {
        let helpText = "";
        
        switch(gameState.level) {
            case 1:
                helpText = `
<span class='text-cyan-400'>Level 1 Hints (Core Workflow):</span>
  git status       : Check what's happening
  git checkout -b  : Create a new branch
  git add .        : Stage your changes
  git commit -m    : Save your changes
  git checkout     : Switch back to main
  git merge        : Combine your fix`;
                break;
            case 2:
                helpText = `
<span class='text-cyan-400'>Level 2 Hints (Undo):</span>
  git log          : Find the bad commit hash
  git revert [id]  : Undo the bug`;
                break;
            case 3:
                helpText = `
<span class='text-cyan-400'>Level 3 Hints (Advanced):</span>
  git log          : Find the golden block
  git cherry-pick  : Teleport the specific commit`;
                break;
            case 4:
                helpText = `
<span class='text-cyan-400'>Level 4 Hints (Rebase):</span>
  git rebase -i    : Start interactive rebase
  swap c1 slot1    : Reorder blocks (no brackets)`;
                break;
            default:
                helpText = `
<span class='text-cyan-400'>Universal Commands:</span>
  move [w/a/s/d]   : Move Keif
  git status       : Check state
  git log          : View history`;
        }

        addLog(helpText);
        sound.playCommandSuccess();
        return;
    }

    if (cmd === 'move') {
        if(subCmd === 'w' || subCmd === 'north') movePlayer(0, -1);
        else if(subCmd === 's' || subCmd === 'south') movePlayer(0, 1);
        else if(subCmd === 'a' || subCmd === 'west') movePlayer(-1, 0);
        else if(subCmd === 'd' || subCmd === 'east') movePlayer(1, 0);
        return;
    }
    
    if (cmd === 'swap' && gameState.level === 4) {
        if (!subCmd || !arg) { addLog("Usage: swap c1 slot1"); return; }
        
        // Sanitize input: Remove brackets if user types them (e.g. [c1] -> c1)
        const cleanSubCmd = subCmd.replace(/[\[\]]/g, '');
        const cleanArg = arg.replace(/[\[\]]/g, '');

        // Find entities by Label (e.g. C1, C2, Slot1, Slot2) - CASE INSENSITIVE
        const e1 = levelConfig.entities.find(e => e.label && e.label.toLowerCase() === cleanSubCmd.toLowerCase());
        const e2 = levelConfig.entities.find(e => e.label && e.label.toLowerCase() === cleanArg.toLowerCase());

        if (e1 && e2) {
            const pos1 = { ...e1.position };
            const pos2 = { ...e2.position };
            
            // Swap positions in config
            setLevelConfig(prev => {
                const newEntities = prev.entities.map(e => {
                    if (e.id === e1.id) return { ...e, position: pos2 };
                    if (e.id === e2.id) return { ...e, position: pos1 };
                    return e;
                });
                
                // Check if puzzle solved after this swap
                // We check based on ID to be safe
                const c1 = newEntities.find(e => e.label === 'C1');
                const c2 = newEntities.find(e => e.label === 'C2');
                
                // If both are on y=1, we are good (assuming only slots are on y=1)
                if (c1?.position.y === 1 && c2?.position.y === 1 && !gameState.commits.includes('rebased')) {
                     setTimeout(() => {
                         addLog("<span class='text-green-400'>REBASE SUCCESS: Commits aligned. History linear.</span>");
                         sound.playMerge();
                         spawnParticles(c1.position.x, c1.position.y, c1.position.z, COLORS.KRAKEN_GREEN, 20);
                         spawnParticles(c2.position.x, c2.position.y, c2.position.z, COLORS.KRAKEN_GREEN, 20);
                         setGameState(prev => ({
                             ...prev,
                             commits: [...prev.commits, 'rebased']
                         }));
                     }, 500);
                }

                return { ...prev, entities: newEntities };
            });
            
            spawnParticles(pos1.x, pos1.y, pos1.z, COLORS.GIT_ORANGE, 10);
            spawnParticles(pos2.x, pos2.y, pos2.z, COLORS.GIT_ORANGE, 10);
            sound.playBranch();
            addLog(`Swapped ${e1.label} and ${e2.label}.`);
            
            const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'swap');
            if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));

        } else {
            addLog("Invalid targets. Use 'C1', 'C2', 'Slot1', or 'Slot2'.");
            sound.playCommandError();
        }
        return;
    }

    if (cmd !== 'git') {
      addLog(`bash: ${cmd}: command not found. Try 'help'.`);
      sound.playCommandError();
      triggerShake(0.2);
      return;
    }

    if (subCmd === 'status') {
      if (gameState.level === 1) {
        if (gameState.commits.includes('merge:fix-bridge')) {
            addLog(`On branch main. All clean.`);
        } else if (gameState.inventory.length > 0) {
            addLog(`On branch ${gameState.currentBranch}.\nChanges to be committed:\n  <span class='text-green-400'>modified: bridge.js</span>`);
        } else if (gameState.currentBranch === 'main') {
            addLog(`On branch main.\n<span class='text-red-400'>You are detached from HEAD.</span>\nLogic for 'bridge.js' is missing.`);
        } else {
            addLog(`On branch ${gameState.currentBranch}.\nNothing to commit.`);
        }
      } else {
         addLog(`On branch ${gameState.currentBranch}. Working tree clean.`); 
      }
      
      sound.playCommandSuccess();
      const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'status');
      if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
      return;
    }

    if (subCmd === 'branch') {
        const branchList = gameState.branches.map(b => 
            b === gameState.currentBranch ? `<span class='text-green-400'>* ${b}</span>` : `  ${b}`
        ).join('\n');
        addLog(branchList);
        sound.playCommandSuccess();
        return;
    }

    if (subCmd === 'log') {
        let history = '';
        if (gameState.level === 1) {
            history = `<span class='text-yellow-400'>commit a8c12d (HEAD -> main)</span>\nAuthor: Keif\n    Initial commit`;
        } else if (gameState.level === 2) {
             history = `
<span class='text-yellow-400'>commit bad123 (HEAD -> main)</span>
Author: BadActor
    Added critical bug that blocks everything
<span class='text-yellow-400'>commit feat99</span>
    Fancy UI update
<span class='text-yellow-400'>commit init00</span>
    Initial commit`;
        } else if (gameState.level === 3) {
            history = `
<span class='text-yellow-400'>commit main88 (HEAD -> main)</span>
    Work in progress...

<span class='text-purple-400'>commit a1b2c3 (feature)</span>
    [Golden Block] Perfect bridge logic (STABLE)

<span class='text-purple-400'>commit bug001 (feature)</span>
    [Lava] Experimental lava rendering (UNSTABLE)
            `;
        } else if (gameState.level === 4) {
             history = `
<span class='text-yellow-400'>commit (HEAD -> feature-messy)</span>
    ...
<span class='text-red-400'>pick C2</span> (Out of order - y:2)
<span class='text-red-400'>pick C1</span> (Out of order - y:0)
             `;
        }
        addLog(history);
        sound.playCommandSuccess();
        const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'log');
        if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
        return;
    }
    
    if (subCmd === 'rebase') {
        if (gameState.level === 4 && arg === '-i') {
             addLog("Interactive Rebase initiated.");
             addLog("Commits are physically scattered. Use <span class='text-cyan-400'>swap c1 slot1</span> to move blocks.");
             sound.playMerge();
             const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'rebase');
             if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
             return;
        }
    }

    if (subCmd === 'revert') {
        if (gameState.level === 2 && (arg === 'bad123' || arg === 'HEAD')) {
            setGameState(prev => ({
                ...prev,
                commits: [...prev.commits, 'revert:bad-commit']
            }));
            
            const bug = levelConfig.entities.find(e => e.id === 'bug_wall');
            if (bug) {
                spawnParticles(bug.position.x, bug.position.y, bug.position.z, COLORS.OBSTACLE_BUG, 20);
            }

            setLevelConfig(prev => ({
                ...prev,
                entities: prev.entities.filter(e => e.id !== 'bug_wall')
            }));
            
            addLog(`[main 9g8h7i] Revert "Added critical bug..."\n 1 file changed, 1 deletion(-)`);
            sound.playRevert(); 
            
            const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'revert');
            if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
            return;
        } else {
            addLog("fatal: Bad revision " + arg);
            sound.playCommandError();
            triggerShake(0.5);
            return;
        }
    }

    if (subCmd === 'cherry-pick') {
        if (gameState.level === 3 && arg === 'a1b2c3') {
            const block = levelConfig.entities.find(e => e.label === 'a1b2c3');
            if (block) {
                // Animation to new pos
                const newPos = { x: 3, y: 1, z: 0 }; // Ground level
                
                // Interpolate particle trail
                spawnParticles(block.position.x, block.position.y, block.position.z, COLORS.BLOCK_GOLD, 15);
                for(let i=0; i<6; i++) {
                    setTimeout(() => {
                         const t = i/5;
                         const lx = block.position.x + (newPos.x - block.position.x) * t;
                         const ly = block.position.y + (newPos.y - block.position.y) * t;
                         const lz = block.position.z + (newPos.z - block.position.z) * t;
                         spawnParticles(lx, ly, lz + 0.5, COLORS.BLOCK_GOLD, 4);
                    }, i * 100);
                }

                setLevelConfig(prev => ({
                    ...prev,
                    entities: prev.entities.map(e => {
                        if (e.label === 'a1b2c3') {
                            return { ...e, position: newPos, color: COLORS.BRANCH_MAIN, type: EntityType.Block };
                        }
                        return e;
                    })
                }));
                
                setGameState(prev => ({ ...prev, commits: [...prev.commits, 'cherry:bridge'] }));

                addLog(`[main 7f2e1d] Cherry-pick: a1b2c3\n 1 file changed, 1 insertion(+)`);
                addLog(`Gap bridged! Move Keif to the finish line.`); 
                sound.playMerge();

                const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'cherry-pick');
                if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
                return;
            }
        }
        addLog(`fatal: bad object ${arg}`);
        sound.playCommandError();
        triggerShake(0.3);
        return;
    }

    if (subCmd === 'checkout') {
      if (arg === '-b') {
        const branchName = parts[3];
        if (!branchName) { addLog("Error: Branch name required."); sound.playCommandError(); triggerShake(0.2); return; }
        
        if (gameState.branches.includes(branchName)) {
            addLog(`fatal: A branch named '${branchName}' already exists.`);
            sound.playCommandError();
            triggerShake(0.2);
            return;
        }
        
        setGameState(prev => ({
            ...prev,
            branches: [...prev.branches, branchName],
            currentBranch: branchName
        }));

        if (branchName === 'fix-bridge' && gameState.level === 1) {
            const bridgeVoxels: VoxelEntity[] = [];
            for(let i=1; i<=3; i++) {
                bridgeVoxels.push({
                    id: `bridge_conn_${i}`,
                    type: EntityType.Block,
                    position: { x: 1, y: 1 + i, z: 1 },
                    color: COLORS.BRANCH_FEATURE
                });
            }
            bridgeVoxels.forEach(v => spawnParticles(v.position.x, v.position.y, v.position.z, COLORS.BRANCH_FEATURE, 5));

            setLevelConfig(prev => ({
                ...prev,
                entities: [...prev.entities, ...bridgeVoxels]
            }));
            addLog(`Switched to a new branch '${branchName}'.`);
            sound.playBranch();
            
            const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', { cmd: 'checkout', arg: '-b' });
            if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));

        } else {
            addLog(`Switched to a new branch '${branchName}'.`);
            sound.playBranch();
        }

      } else {
        const branchName = parts[2];
        if (!gameState.branches.includes(branchName)) {
            addLog(`error: pathspec '${branchName}' did not match any file(s).`);
            sound.playCommandError();
            triggerShake(0.2);
            return;
        }
        setGameState(prev => ({ ...prev, currentBranch: branchName }));
        addLog(`Switched to branch '${branchName}'`);
        sound.playCommandSuccess();

        const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', { cmd: 'checkout', arg: 'existing' });
        if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
      }
      return;
    }

    if (subCmd === 'add') {
      const resource = levelConfig.entities.find(e => 
        e.type === EntityType.Resource && 
        e.position.x === playerPos.x && 
        e.position.y === playerPos.y
      );

      // SAFEGUARD: Ensure resource exists before accessing props
      if (resource && !resource.isHidden) {
          setGameState(prev => ({ ...prev, inventory: [...prev.inventory, resource.label || 'file'] }));
          setLevelConfig(prev => ({
              ...prev,
              entities: prev.entities.map(e => e.id === resource.id ? { ...e, isHidden: true } : e)
          }));
          spawnParticles(playerPos.x, playerPos.y, playerPos.z + 1, COLORS.GIT_ORANGE, 10);
          addLog("Changes staged for commit.");
          sound.playCommandSuccess();
          
          const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'add');
          if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
      } else {
          addLog("Nothing to add here.");
          sound.playCommandError();
          triggerShake(0.1);
      }
      return;
    }

    if (subCmd === 'commit') {
        if (gameState.inventory.length === 0) {
            addLog("nothing to commit, working tree clean");
            sound.playCommandError();
            triggerShake(0.1);
            return;
        }
        setGameState(prev => ({
            ...prev,
            commits: [...prev.commits, 'commit:resources'],
            inventory: []
        }));
        addLog(`[${gameState.currentBranch} 8a2f9c] Fixed bridge logic\n 1 file changed, 10 insertions(+)`);
        sound.playCommit();
        
        const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'commit');
        if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
        return;
    }

    if (subCmd === 'merge') {
        const targetBranch = parts[2];
        if (gameState.currentBranch !== 'main') {
            addLog("Please checkout main before merging.");
            sound.playCommandError();
            triggerShake(0.2);
            return;
        }
        if (!gameState.commits.includes('commit:resources')) {
            addLog("Branch is clean, nothing to merge.");
            sound.playCommandError();
            triggerShake(0.2);
            return;
        }

        addLog(`<span class='text-red-500 font-bold'>CONFLICT DETECTED!</span> Auto-merge failed.`);
        addLog(`Manual intervention required. Resolve the markers!`);
        
        startMinigame(() => {
             setGameState(prev => ({
                ...prev,
                commits: [...prev.commits, 'merge:fix-bridge']
            }));

            const bridgeFix: VoxelEntity = {
                id: 'bridge_fix_main',
                type: EntityType.Block,
                position: { x: 3, y: 1, z: 0 },
                color: COLORS.BRANCH_MAIN,
            };

            setLevelConfig(prev => ({
                ...prev,
                entities: [
                    ...prev.entities.filter(e => e.type !== EntityType.Obstacle),
                    bridgeFix
                ]
            }));
            
            spawnParticles(3, 1, 1, COLORS.BRANCH_MAIN, 20);
            addLog(`Merge Conflict Resolved! Commit applied.`);
            sound.playMerge();
            
            const tutorialUpdate = updateTutorialState(gameState.level, gameState.tutorialStep, 'COMMAND', 'merge');
            if (tutorialUpdate) setGameState(prev => ({ ...prev, ...tutorialUpdate }));
        });
        return;
    }

    addLog(`bash: ${cmd}: command not found. Try 'help'.`);
    sound.playCommandError();
    triggerShake(0.1);
  };

  return {
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
  };
};
