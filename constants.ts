
import { EntityType, LevelConfig, Vector3 } from './types';

export const COLORS = {
  KRAKEN_GREEN: '#00D664',
  KRAKEN_DARK: '#00ad50',
  GIT_RED: '#F05033',
  GIT_ORANGE: '#F05033',
  BRANCH_MAIN: '#00bfff',
  BRANCH_FEATURE: '#ff00ff',
  GROUND: '#374151',
  VOID: '#111827',
  RESOURCE_WOOD: '#d97706',
  OBSTACLE_VOID: '#ef4444',
  OBSTACLE_BUG: '#dc2626', // Red for bugs
  OBSTACLE_LAVA: '#b91c1c',
  GUIDE_ARROW: '#FACC15', // Yellow
  BLOCK_GOLD: '#fbbf24',
  REBASE_BLOCK: '#8b5cf6', // Violet
  PLACEHOLDER: '#1f2937' // Dark slot
};

export const GIT_COMMAND_DATA = [
  // Core Workflow
  { 
    category: 'CORE',
    cmd: 'git init', 
    desc: 'Starts a new Git repository. Turns a regular folder into a tracked project.' 
  },
  { 
    category: 'CORE',
    cmd: 'git status', 
    desc: 'Checks the health of your repo. Shows which files are staged, modified, or untracked.' 
  },
  { 
    category: 'CORE',
    cmd: 'git add [file]', 
    desc: 'Stages changes. It tells Git, "I want to include this file in the next save snapshot."' 
  },
  { 
    category: 'CORE',
    cmd: 'git commit -m "msg"', 
    desc: 'Saves the snapshot to history. Like a checkpoint in a game with a message explaining what you did.' 
  },
  { 
    category: 'CORE',
    cmd: 'git log', 
    desc: 'View history. Scrolls through the timeline of all commits made in the repository.' 
  },
  
  // Branching & Merging
  { 
    category: 'BRANCHING',
    cmd: 'git branch [name]', 
    desc: 'Creates a new timeline (branch). Perfect for working on features without breaking the main code.' 
  },
  { 
    category: 'BRANCHING',
    cmd: 'git checkout [name]', 
    desc: 'Switches timelines. Jumps your working files to the state of a specific branch.' 
  },
  { 
    category: 'BRANCHING',
    cmd: 'git merge [branch]', 
    desc: 'Combines timelines. Takes changes from one branch and adds them into your current one.' 
  },
  { 
    category: 'BRANCHING',
    cmd: 'git switch [name]', 
    desc: 'The modern way to switch branches. Easier to remember than checkout!' 
  },

  // Remote / GitHub
  { 
    category: 'GITHUB',
    cmd: 'git clone [url]', 
    desc: 'Downloads a repository from the cloud (GitHub) to your local machine.' 
  },
  { 
    category: 'GITHUB',
    cmd: 'git push', 
    desc: 'Uploads your commits to the cloud. Syncs your local saves with GitHub.' 
  },
  { 
    category: 'GITHUB',
    cmd: 'git pull', 
    desc: 'Downloads new changes from the cloud. Updates your local files with what others have done.' 
  },
  { 
    category: 'GITHUB',
    cmd: 'Fork (GitHub)', 
    desc: 'Makes a personal copy of someone else\'s project on your GitHub account so you can experiment.' 
  },
  { 
    category: 'GITHUB',
    cmd: 'Pull Request (PR)', 
    desc: 'A request to merge your changes into the original project. The heart of open source collaboration!' 
  },

  // Advanced / Fixes
  { 
    category: 'ADVANCED',
    cmd: 'git revert [hash]', 
    desc: 'Safely undoes a specific commit by creating a new "inverse" commit. History remains intact.' 
  },
  { 
    category: 'ADVANCED',
    cmd: 'git cherry-pick', 
    desc: 'Teleports a specific commit from one branch to another without merging the whole timeline.' 
  },
  { 
    category: 'ADVANCED',
    cmd: 'git rebase -i', 
    desc: 'Interactive Rebase. Powerful history rewriting. Used to reorder, squash, or edit commits.' 
  },
  { 
    category: 'ADVANCED',
    cmd: 'git stash', 
    desc: 'Temporarily shelves your changes so you can switch tasks, then brings them back later.' 
  },
  { 
    category: 'ADVANCED',
    cmd: 'git reset', 
    desc: 'Rewinds time. Dangerous! Can delete history. Use carefully to unstage files.' 
  }
];

// Helper to create grid
const createPlatform = (x: number, y: number, w: number, h: number, z: number, color: string): any[] => {
  const blocks = [];
  for(let i=0; i<w; i++) {
    for(let j=0; j<h; j++) {
      blocks.push({
        id: `ground_${x+i}_${y+j}_${z}`,
        type: EntityType.Block,
        position: { x: x+i, y: y+j, z },
        color,
      });
    }
  }
  return blocks;
};

export const LEVEL_1: LevelConfig = {
  id: 1,
  name: "The Detached Bridge",
  description: "The main branch is broken. Branch off, build a fix, and merge it back.",
  startPos: { x: 1, y: 1, z: 1 },
  winCondition: (state) => state.commits.includes('merge:fix-bridge'),
  entities: [
    // Main Branch Platform (Start)
    ...createPlatform(0, 0, 3, 3, 0, COLORS.BRANCH_MAIN),
    
    // Main Branch Platform (End/Goal)
    ...createPlatform(4, 0, 3, 3, 0, COLORS.BRANCH_MAIN),
    {
      id: 'goal_flag',
      type: EntityType.Goal,
      position: { x: 5, y: 1, z: 1 },
      color: '#fbbf24',
      label: 'HEAD'
    },

    // The "Feature" Branch Platform (Needs to be traveled to)
    ...createPlatform(1, 4, 3, 3, 0, COLORS.BRANCH_FEATURE),
    
    // Resource to collect
    {
      id: 'resource_wood',
      type: EntityType.Resource,
      position: { x: 2, y: 5, z: 1 },
      color: COLORS.RESOURCE_WOOD,
      label: 'bridge.js'
    },
    
    // Obstacle blocking the goal (The Void)
    {
      id: 'obstacle_void',
      type: EntityType.Obstacle,
      position: { x: 3, y: 1, z: 0 },
      color: COLORS.OBSTACLE_VOID,
      label: 'CONFLICT'
    }
  ]
};

export const LEVEL_2: LevelConfig = {
    id: 2,
    name: "The Revert Realm",
    description: "A bad commit has introduced a bug! Check the logs and revert the change.",
    startPos: { x: 1, y: 1, z: 1 },
    winCondition: (state) => state.commits.includes('revert:bad-commit'),
    entities: [
        // Long Main Branch
        ...createPlatform(0, 0, 7, 3, 0, COLORS.BRANCH_MAIN),
        
        // Goal
        {
            id: 'goal_flag',
            type: EntityType.Goal,
            position: { x: 6, y: 1, z: 1 },
            color: '#fbbf24',
            label: 'PROD'
        },

        // The Bug (Obstacle)
        {
            id: 'bug_wall',
            type: EntityType.Obstacle,
            position: { x: 3, y: 1, z: 1 }, // Sits ON TOP of the platform, blocking path
            color: COLORS.OBSTACLE_BUG,
            label: 'BUG',
            scale: 1.2
        }
    ]
};

export const LEVEL_3: LevelConfig = {
    id: 3,
    name: "The Cherry-Pick Chasm",
    description: "You need a bridge from the 'feature' branch, but merging brings bugs. Pick only what you need.",
    startPos: { x: 1, y: 1, z: 1 },
    winCondition: (state) => state.commits.includes('cherry:bridge'),
    entities: [
        // Main Branch (Left side)
        ...createPlatform(0, 0, 3, 3, 0, COLORS.BRANCH_MAIN),
        
        // Main Branch (Right side - Goal)
        ...createPlatform(4, 0, 3, 3, 0, COLORS.BRANCH_MAIN),
        {
            id: 'goal_flag',
            type: EntityType.Goal,
            position: { x: 5, y: 1, z: 1 },
            color: '#fbbf24',
            label: 'RELEASE'
        },

        // Feature Branch (Parallel, unreachable by walking)
        ...createPlatform(1, 4, 5, 2, 0, COLORS.BRANCH_FEATURE),

        // The Good Commit (The Bridge Block) sitting on the feature branch
        {
            id: 'good_commit',
            type: EntityType.Resource, // Treat as resource for now, but used for logic
            position: { x: 3, y: 4, z: 1 },
            color: COLORS.BLOCK_GOLD,
            label: 'a1b2c3' // The hash
        },
        
        // The Bad Commits (Lava) surrounding it
        { id: 'lava1', type: EntityType.Decoration, position: { x: 2, y: 4, z: 1 }, color: COLORS.OBSTACLE_LAVA, label: 'bug' },
        { id: 'lava2', type: EntityType.Decoration, position: { x: 4, y: 4, z: 1 }, color: COLORS.OBSTACLE_LAVA, label: 'bug' },
    ]
};

export const LEVEL_4: LevelConfig = {
    id: 4,
    name: "The Rebase Ridge",
    description: "The commits are scattered and out of order. Swap them into the slots to build a bridge.",
    startPos: { x: 1, y: 1, z: 1 },
    winCondition: (state) => state.commits.includes('rebased'),
    entities: [
        // Start Platform
        ...createPlatform(0, 0, 2, 3, 0, COLORS.BRANCH_MAIN),
        
        // Goal Platform (Far right)
        ...createPlatform(4, 0, 2, 3, 0, COLORS.BRANCH_MAIN),
        {
            id: 'goal_flag',
            type: EntityType.Goal,
            position: { x: 5, y: 1, z: 1 },
            color: '#fbbf24',
            label: 'HEAD'
        },

        // THE PUZZLE:
        // Path is at Y=1. 
        // We have empty slots at (2,1) and (3,1).
        { id: 'slot1', type: EntityType.Decoration, position: { x: 2, y: 1, z: 0 }, color: COLORS.PLACEHOLDER, label: 'Slot1' },
        { id: 'slot2', type: EntityType.Decoration, position: { x: 3, y: 1, z: 0 }, color: COLORS.PLACEHOLDER, label: 'Slot2' },

        // We have the Commits scattered off-path.
        {
            id: 'c1',
            type: EntityType.Block, // Walkable
            position: { x: 2, y: 0, z: 0 }, // Off to side
            color: COLORS.REBASE_BLOCK,
            label: 'C1'
        },
        {
            id: 'c2',
            type: EntityType.Block, // Walkable
            position: { x: 3, y: 2, z: 0 }, // Off to side
            color: COLORS.REBASE_BLOCK,
            label: 'C2'
        },
    ]
};
