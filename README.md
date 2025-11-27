# 🐙 GitKraken: Voxel Verse

> **A 3D Gamified Git Experience built for GitKon 2025.**  
> Master version control mechanics in a visually stunning voxel world.

![Game Banner](https://i.imgur.com/your-banner-image-placeholder.png) *Replace with a screenshot of your Intro Screen*

## 🎮 Introduction

**GitKraken: Voxel Verse** transforms abstract Git concepts into tangible, 3D puzzles. Players control **Keif the Kraken** in a voxel-based repository, solving challenges that require real Git commands to progress.

Instead of reading documentation, players *live* the workflow:
*   **Merge Conflicts** become boss battles.
*   **Rebasing** involves physically rearranging timeline blocks.
*   **Cherry-picking** is a teleportation mechanic.

This project was built to bridge the gap between "Learning Git" and "Having Fun," winning the **GitKon 2025 Game Jam**.

---

## 🏗️ Technical Architecture

The game is built entirely with web technologies, using **React** for the UI and a custom **CSS-based 3D Engine** for the graphics (no Canvas/WebGL required!).

### 1. The Voxel Engine (`VoxelEngine.tsx`)
Instead of using heavy libraries like Three.js, we built a lightweight, DOM-based voxel renderer.
*   **Pure CSS 3D Transforms:** Every block, character, and particle is a `<div>` manipulated in 3D space using `transform-style: preserve-3d`.
*   **React Memoization:** Uses `React.memo` and stable keys to ensure 60fps performance even with hundreds of DOM nodes.
*   **Composite Models:** Characters like Keif are assembled from multiple voxel primitives, allowing for independent animation of head, tentacles, and eyes.

### 2. The Git Logic Kernel (`useGameLogic.ts`)
The game state acts as a pseudo-Git repository.
*   **Virtual File System:** Tracks `inventory` (staged files), `commits` (history), and `branches`.
*   **Command Parser:** A robust CLI implementation that parses strings like `git checkout -b feature` and maps them to game actions.
*   **Level State Machine:** Handles win conditions, tutorial triggers, and puzzle validation (e.g., checking if commits are physically aligned for a rebase).

### 3. Audio Synthesis Engine (`useSound.ts`)
A generative soundtrack that creates music in real-time using the **Web Audio API**.
*   **No MP3s:** All sounds are synthesized oscillators.
*   **Lookahead Scheduler:** Ensures rock-solid timing for the techno-beat, unaffected by React render cycles.
*   **Dynamic Mixing:** Audio evolves based on game state (e.g., intense music during merge conflicts).

### 4. Real-time Visualization (`GitGraph.tsx`)
A dynamic SVG component that renders a "Metro Map" style commit graph.
*   **Bezier Curves:** smooth paths connecting commits.
*   **Lane System:** Automatically separates `main` and `feature` branches.
*   **Live Updates:** As you play, the graph grows.

---

## 🧩 Game Mechanics & Levels

### Level 1: The Detached Bridge
**Concept:** Branching & Merging  
The main path is broken. The player must:
1.  Create a new branch (`git checkout -b fix`).
2.  Walk to a resource block to stage it (`git add .`).
3.  Commit the fix (`git commit`).
4.  Merge it back to main (`git merge`) to solidify the bridge.

### Level 2: The Revert Realm
**Concept:** Undoing Changes  
A giant "Bug" obstacle blocks the path.
1.  Inspect history (`git log`) to find the bad commit hash.
2.  Use `git revert [hash]` to destroy the bug and clear the path.

### Level 3: The Cherry-Pick Chasm
**Concept:** Selective Merging  
The player needs a bridge block from a parallel "feature" timeline, but the feature branch is full of "Lava" (bugs).
1.  Identify the one good commit hash.
2.  Use `git cherry-pick [hash]` to teleport *only* that block to the main timeline.

### Level 4: Rebase Ridge
**Concept:** Interactive Rebase  
The timeline is physically scattered. Commits are floating in the wrong positions.
1.  Enter rebase mode (`git rebase -i`).
2.  Use the custom `swap` command to physically reorder the voxel blocks into the correct linear slots.

---

## 💻 Installation & Setup

This is a standard React + Vite application.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/voxel-verse.git
    cd voxel-verse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 📸 Gallery

| **The Intro** | **The Game World** |
|:---:|:---:|
| ![Intro](https://via.placeholder.com/400x200?text=Intro+Screen) | ![Gameplay](https://via.placeholder.com/400x200?text=Voxel+Gameplay) |
| *Cinematic 3D CSS Title* | *Isometric Voxel Engine* |

| **Mission Select** | **Knowledge Base** |
|:---:|:---:|
| ![Map](images\Screenshot 2025-11-27 203003.png) | ![Docs](https://via.placeholder.com/400x200?text=Knowledge+Base) |
| *Cosmic Navigation* | *Interactive Documentation* |

---

## 🌟 Conclusion

**GitKraken: Voxel Verse** proves that developer tools don't have to be boring. By visualizing abstract data structures as physical objects, we make learning Git intuitive and rewarding. 

Whether you are a junior dev struggling with `rebase` or a senior dev who just wants to see a voxel Kraken spin, there is something here for you.

**Built with 💜 by _SEJAL_KAMBLE_  for GitKon 2025 Game Jam**
