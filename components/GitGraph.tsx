
import React, { useMemo, useState } from 'react';
import { GameState } from '../types';
import { COLORS } from '../constants';

interface GitGraphProps {
  state: GameState;
}

export const GitGraph: React.FC<GitGraphProps> = ({ state }) => {
  const { commits, currentBranch, branches, level } = state;
  const [hoveredNode, setHoveredNode] = useState<{
    x: number;
    y: number;
    id: string;
    msg: string;
    author: string;
    date: string;
    color: string;
    branch: string;
    remote?: string | null;
    clientX: number;
    clientY: number;
  } | null>(null);

  // --- MOCK METADATA ---
  const getCommitInfo = (id: string) => {
      const map: Record<string, { msg: string, author: string, date: string }> = {
          'init': { msg: 'Initial commit', author: 'Keif', date: '2 days ago' },
          'wip': { msg: 'Work in progress...', author: 'Keif', date: '1 min ago' },
          'fix': { msg: 'Fix bridge physics', author: 'Keif', date: 'Just now' },
          'merge': { msg: 'Merge branch \'fix-bridge\'', author: 'Keif', date: 'Just now' },
          'feat': { msg: 'Add shiny graphics', author: 'Dev_X', date: '1 day ago' },
          'bad': { msg: 'Update game logic (BUGGY)', author: 'Chaos_Bot', date: '5 hours ago' },
          'revert': { msg: 'Revert "Update game logic"', author: 'Keif', date: 'Just now' },
          'm1': { msg: 'Update documentation', author: 'Keif', date: '3 days ago' },
          'f1': { msg: 'Start feature branch', author: 'Dev_Y', date: '2 days ago' },
          'gold': { msg: '[Stable] Bridge Algorithm', author: 'Dev_Y', date: '1 day ago' },
          'pick': { msg: 'Cherry-pick: Bridge Algo', author: 'Keif', date: 'Just now' },
          'C1': { msg: 'Refactor rendering', author: 'Keif', date: 'Monday' },
          'C2': { msg: 'Optimize particles', author: 'Keif', date: 'Tuesday' },
      };
      return map[id] || { msg: 'Commit', author: 'Keif', date: 'Today' };
  };

  // --- GRAPH GENERATOR ---
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    const tracks: any[] = []; 

    // Coords
    const MAIN_Y = 50;
    const FEAT_Y = 20; 
    const FEAT_Y_BELOW = 80;
    let x = 40;
    const step = 60; // Wider step for better readability

    const getRemoteRef = (id: string) => {
        if (level === 1 && id === 'init') return 'origin/main';
        if (level === 2 && id === 'bad') return 'origin/main';
        if (level === 3 && id === 'm1') return 'origin/main';
        if (level === 4 && id === 'init') return 'origin/main';
        return null;
    };

    const addNode = (id: string, lx: number, ly: number, color: string, branch: string, extra: any = {}) => {
        const remote = getRemoteRef(id);
        nodes.push({ id, x: lx, y: ly, color, branch, remote, ...extra, ...getCommitInfo(id) });
    };

    const addLink = (x1: number, y1: number, x2: number, y2: number, color: string, type: 'straight' | 'curve' | 'merge', dashed = false) => {
        links.push({ 
            id: `link-${x1}-${y1}-${x2}-${y2}`, 
            x1, y1, x2, y2, color, type, dashed 
        });
    };

    // LEVEL 1: Branch & Merge
    if (level === 1) {
        tracks.push({ x: 20, y: MAIN_Y, width: 400, color: COLORS.BRANCH_MAIN });
        
        addNode('init', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        x += step;

        if (branches.includes('fix-bridge')) {
            tracks.push({ x: x - 20, y: FEAT_Y, width: 250, color: COLORS.BRANCH_FEATURE });
            
            addLink(x - step, MAIN_Y, x, FEAT_Y, COLORS.BRANCH_FEATURE, 'curve');
            
            if (commits.includes('commit:resources')) {
                addNode('fix', x, FEAT_Y, COLORS.BRANCH_FEATURE, 'fix-bridge');
                x += step;
            } else {
                addNode('wip', x, FEAT_Y, COLORS.BRANCH_FEATURE, 'fix-bridge', { ghost: true });
            }
        }

        if (commits.includes('merge:fix-bridge')) {
            addLink(x - step, FEAT_Y, x, MAIN_Y, COLORS.BRANCH_FEATURE, 'merge');
            addNode('merge', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main', { type: 'merge' });
        }
    }

    // LEVEL 2: Revert
    else if (level === 2) {
        tracks.push({ x: 20, y: MAIN_Y, width: 500, color: COLORS.BRANCH_MAIN });

        addNode('init', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        addLink(x, MAIN_Y, x + step, MAIN_Y, COLORS.BRANCH_MAIN, 'straight');
        x += step;

        addNode('feat', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        addLink(x, MAIN_Y, x + step, MAIN_Y, COLORS.BRANCH_MAIN, 'straight');
        x += step;

        addNode('bad', x, MAIN_Y, COLORS.GIT_RED, 'main');
        
        if (commits.includes('revert:bad-commit')) {
             addLink(x, MAIN_Y, x + step, MAIN_Y, COLORS.BRANCH_MAIN, 'straight');
             x += step;
             addNode('revert', x, MAIN_Y, COLORS.KRAKEN_GREEN, 'main');
        }
    }

    // LEVEL 3: Cherry Pick
    else if (level === 3) {
        tracks.push({ x: 20, y: MAIN_Y, width: 400, color: COLORS.BRANCH_MAIN });
        tracks.push({ x: 20, y: FEAT_Y_BELOW, width: 300, color: COLORS.BRANCH_FEATURE });

        addNode('m1', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        addNode('f1', x, FEAT_Y_BELOW, COLORS.BRANCH_FEATURE, 'feature');
        addLink(x, FEAT_Y_BELOW, x + step, FEAT_Y_BELOW, COLORS.BRANCH_FEATURE, 'straight');
        x += step;

        addNode('gold', x, FEAT_Y_BELOW, COLORS.BLOCK_GOLD, 'feature', { label: 'a1b2c3' });
        addLink(x, FEAT_Y_BELOW, x + step, FEAT_Y_BELOW, COLORS.OBSTACLE_LAVA, 'straight');
        
        addNode('bad', x + step, FEAT_Y_BELOW, COLORS.OBSTACLE_LAVA, 'feature');

        if (commits.includes('cherry:bridge')) {
            // Dashed copy line
            addLink(x, FEAT_Y_BELOW, x + step, MAIN_Y, COLORS.BLOCK_GOLD, 'merge', true);
            x += step;
            addNode('pick', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
            addLink(40, MAIN_Y, x, MAIN_Y, COLORS.BRANCH_MAIN, 'straight', true);
        }
    }

    // LEVEL 4: Rebase
    else if (level === 4) {
        tracks.push({ x: 20, y: MAIN_Y, width: 400, color: COLORS.BRANCH_MAIN });
        
        addNode('init', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        
        if (!commits.includes('rebased')) {
            addLink(x, MAIN_Y, x + step, FEAT_Y, COLORS.REBASE_BLOCK, 'curve', true);
            addNode('C1', x + step, FEAT_Y, COLORS.REBASE_BLOCK, 'feature', { ghost: true, label: 'C1' });
            
            addLink(x + step, FEAT_Y, x + step * 2, FEAT_Y_BELOW, COLORS.REBASE_BLOCK, 'straight', true);
            addNode('C2', x + step * 2, FEAT_Y_BELOW, COLORS.REBASE_BLOCK, 'feature', { ghost: true, label: 'C2' });
        } else {
            addLink(x, MAIN_Y, x + step, MAIN_Y, COLORS.BRANCH_MAIN, 'straight');
            x += step;
            addNode('C1', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
            
            addLink(x, MAIN_Y, x + step, MAIN_Y, COLORS.BRANCH_MAIN, 'straight');
            x += step;
            addNode('C2', x, MAIN_Y, COLORS.BRANCH_MAIN, 'main');
        }
    }

    return { nodes, links, tracks, maxX: x + 100 };
  }, [state, commits, currentBranch, branches, level]);

  const headNode = graphData.nodes[graphData.nodes.length - 1];

  return (
    <div className="w-full h-full bg-[#0d1117] relative flex flex-col font-mono select-none border-b border-[#30363d]">
        <div className="flex items-center justify-between px-3 py-1 bg-[#161b22] border-b border-[#30363d] shadow-sm z-10 flex-shrink-0">
            <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                GitGraph Visualization
            </span>
            <div className="flex gap-2">
                 {branches.map(b => (
                     <span key={b} className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${b === currentBranch ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/50' : 'text-gray-500 border border-transparent'}`}>
                         {b}
                     </span>
                 ))}
            </div>
        </div>

        {/* SCROLLABLE CONTAINER */}
        <div className="flex-1 relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-gradient-to-b from-[#0d1117] to-[#010409]">
            <div style={{ width: Math.max(graphData.maxX, 500) + 'px', height: '100%' }}>
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="graphGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21262d" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#graphGrid)" />

                    {/* Tracks */}
                    {graphData.tracks.map((t, i) => (
                        <rect 
                            key={i} 
                            x={t.x} y={t.y - 6} width={t.width} height="12" 
                            fill={t.color} rx="6" opacity="0.1"
                            className="animate-pulse-slow"
                        />
                    ))}

                    {/* Links */}
                    {graphData.links.map((link) => (
                        <path 
                            key={link.id}
                            d={link.type === 'curve' 
                                ? `M ${link.x1} ${link.y1} C ${link.x1 + 30} ${link.y1}, ${link.x2 - 30} ${link.y2}, ${link.x2} ${link.y2}`
                                : link.type === 'merge'
                                ? `M ${link.x1} ${link.y1} C ${link.x1 + 30} ${link.y1}, ${link.x2 - 30} ${link.y2}, ${link.x2} ${link.y2}`
                                : `M ${link.x1} ${link.y1} L ${link.x2} ${link.y2}`
                            }
                            fill="none"
                            stroke={link.color}
                            strokeWidth="3"
                            strokeDasharray={link.dashed ? "4 4" : "0"}
                            strokeLinecap="round"
                            opacity={0.8}
                            className="animate-draw-path"
                        />
                    ))}

                    {/* Remote Labels */}
                    {graphData.nodes.map((node) => node.remote && (
                        <g key={`remote-${node.id}`} transform={`translate(${node.x}, ${node.y + 15})`} className="animate-fade-in">
                            <rect x="-28" y="0" width="56" height="12" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" opacity="0.9" />
                            <text x="0" y="8" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="monospace" fontWeight="bold">
                                {node.remote}
                            </text>
                        </g>
                    ))}

                    {/* Nodes */}
                    {graphData.nodes.map((node, i) => (
                        <g 
                            key={node.id} 
                            className="group cursor-pointer transition-transform duration-300 hover:scale-110" 
                            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredNode({ ...node, clientX: rect.left, clientY: rect.top });
                            }}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <circle cx={node.x} cy={node.y} r="8" fill={node.color} opacity="0.2" className="group-hover:opacity-40" />
                            <circle 
                                cx={node.x} cy={node.y} r="5" 
                                fill="#0d1117" 
                                stroke={node.color} strokeWidth="2.5"
                                className={`${node.ghost ? 'opacity-50' : 'opacity-100'}`}
                            />
                            {i === graphData.nodes.length - 1 && !node.ghost && (
                                <circle cx={node.x} cy={node.y} r="10" fill="none" stroke={node.color} strokeWidth="1" className="animate-ping opacity-50" />
                            )}
                        </g>
                    ))}
                </svg>
            </div>
            
            {/* HEAD Label (Overlay inside scroll area) */}
            {headNode && (
                <div 
                    className="absolute pointer-events-none transition-all duration-500 ease-out z-20"
                    style={{ left: `${headNode.x}px`, top: `${headNode.y}px`, transform: 'translate(12px, -50%)' }}
                >
                    <div className="flex items-center gap-1 bg-[#0d1117]/90 px-2 py-0.5 rounded border border-gray-700 shadow-lg backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-[9px] text-gray-300 font-bold">HEAD</span>
                    </div>
                </div>
            )}
        </div>

        {/* Tooltip (Fixed Position Portal basically) */}
        {hoveredNode && (
            <div 
                className="fixed z-[60] bg-[#161b22]/95 backdrop-blur border border-gray-600 rounded-lg p-3 shadow-2xl animate-fade-in-up w-56 pointer-events-none"
                style={{
                    left: `${Math.min(hoveredNode.clientX, window.innerWidth - 240)}px`, 
                    top: `${hoveredNode.clientY + 20}px`
                }}
            >
                <div className="flex items-center justify-between mb-2 border-b border-gray-700 pb-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredNode.color }}></div>
                        <span className="text-xs font-bold text-white font-mono">{hoveredNode.id.substring(0,7)}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 bg-gray-800 px-1 rounded">{hoveredNode.branch}</span>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-200 font-semibold leading-tight">{hoveredNode.msg}</p>
                    {hoveredNode.remote && (
                            <p className="text-[9px] text-blue-400 font-mono">Remote: {hoveredNode.remote}</p>
                    )}
                    <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1 pt-1 border-t border-gray-800">
                        <span>{hoveredNode.author}</span>
                        <span>{hoveredNode.date}</span>
                    </div>
                </div>
            </div>
        )}
        
        <style>{`
            @keyframes draw-path {
                from { stroke-dasharray: 0 1000; }
                to { stroke-dasharray: 1000 0; }
            }
            .animate-draw-path {
                animation: draw-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out; }
            
            /* Custom Scrollbar */
            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #0d1117; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #58a6ff; }
        `}</style>
    </div>
  );
};
