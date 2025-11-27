
export enum Direction {
  North = 'NORTH',
  South = 'SOUTH',
  East = 'EAST',
  West = 'WEST',
}

export enum EntityType {
  Player = 'PLAYER',
  Block = 'BLOCK', // Walkable ground
  Wall = 'WALL',
  Resource = 'RESOURCE', // Something to 'git add'
  Obstacle = 'OBSTACLE', // Needs a merge to clear
  Goal = 'GOAL',
  Decoration = 'DECORATION',
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface VoxelEntity {
  id: string;
  type: EntityType;
  position: Vector3;
  color: string;
  label?: string; // For commit hashes or resource names
  scale?: number;
  rotation?: number;
  isHidden?: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  velocity: Vector3;
  life: number;
}

export interface MinigameState {
  isActive: boolean;
  sequence: string[]; // e.g. ['ArrowUp', 'ArrowDown']
  currentIndex: number;
  timeLeft: number;
  maxTime: number;
  onSuccess?: () => void;
  onFail?: () => void;
}

export interface LevelProgress {
  levelId: number;
  unlocked: boolean;
  stars: number; // 0-3
}

export interface GameState {
  level: number;
  currentBranch: string;
  branches: string[];
  inventory: string[]; // Staged files
  commits: string[]; // History
  status: 'INTRO' | 'MAP' | 'KNOWLEDGE_BASE' | 'PLAYING' | 'WON' | 'LOST';
  message: string; // Feedback from terminal
  tutorialStep: number;
  activeObjective: string; // Text to display in UI
  tutorialTarget?: Vector3; // Coordinate for 3D guide arrow
  shakeIntensity: number; // 0 to 1
  particles: Particle[];
  minigame: MinigameState;
  levelProgress: LevelProgress[];
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  entities: VoxelEntity[];
  startPos: Vector3;
  winCondition: (state: GameState) => boolean;
}
