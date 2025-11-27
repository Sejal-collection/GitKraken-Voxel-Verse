
import React, { memo, useState, useRef, useEffect } from 'react';
import { VoxelEntity, Vector3, EntityType, Particle } from '../types';
import { COLORS } from '../constants';

// ---- PRIMITIVE COMPONENT ----

interface CubeProps {
  position: Vector3;
  color: string;
  size?: number;
  label?: string;
  scale?: Vector3; // Support non-uniform scaling for model parts
  opacity?: number;
  className?: string; // For animations
}

const Cube: React.FC<CubeProps> = memo(({ position, color, size = 50, label, scale = {x:1, y:1, z:1}, opacity=1, className = '' }) => {
  const { x, y, z } = position;
  
  // Outer container: Position relative to parent Model or World
  const outerStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    transformStyle: 'preserve-3d',
    transform: `translateX(${x * size}px) translateY(${y * size}px) translateZ(${z * size}px)`,
    pointerEvents: 'none', // Cubes themselves don't catch events, the Model wrapper does
  };

  // Inner container: Scale & Visuals
  const innerStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      transformStyle: 'preserve-3d',
      transform: `scale3d(${scale.x}, ${scale.y}, ${scale.z})`,
  };

  const faceStyle = (rotate: string, translate: string, brightness: number): React.CSSProperties => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: color,
    opacity: opacity,
    border: opacity < 1 ? 'none' : '1px solid rgba(0,0,0,0.1)', // Remove border for transparency effects
    transform: `${rotate} ${translate}`,
    filter: `brightness(${brightness}%)`,
    backfaceVisibility: opacity < 1 ? 'visible' : 'hidden',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
  });

  return (
    <div style={outerStyle}>
      <div style={innerStyle} className={className}>
          <div style={faceStyle('rotateY(0deg)', `translateZ(${size / 2}px)`, 100)}>
             {label && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] bg-black/70 text-white px-1 rounded">{label}</span>}
          </div>
          <div style={faceStyle('rotateY(180deg)', `translateZ(${size / 2}px)`, 80)} />
          <div style={faceStyle('rotateY(90deg)', `translateZ(${size / 2}px)`, 60)} />
          <div style={faceStyle('rotateY(-90deg)', `translateZ(${size / 2}px)`, 60)} />
          <div style={faceStyle('rotateX(90deg)', `translateZ(${size / 2}px)`, 110)} />
          <div style={faceStyle('rotateX(-90deg)', `translateZ(${size / 2}px)`, 40)} />
      </div>
    </div>
  );
});

// ---- COMPOSITE MODELS ----

interface ModelProps {
    id: string;
    entity: VoxelEntity;
    onInteract?: (id: string, type?: EntityType, label?: string) => void;
}

const VoxelModel: React.FC<ModelProps> = memo(({ id, entity, onInteract }) => {
    const { type, position, color, label } = entity;
    
    const handleContextMenu = (e: React.MouseEvent) => {
        if (onInteract) {
            e.preventDefault();
            e.stopPropagation();
            onInteract(id, type, label);
        }
    };

    // Wrapper for position (x, y, z) in the world grid
    const wrapperStyle: React.CSSProperties = {
        position: 'absolute',
        width: '50px',
        height: '50px',
        transformStyle: 'preserve-3d',
        transform: `translateX(${position.x * 50}px) translateY(${position.y * 50}px) translateZ(${position.z * 50}px)`,
        transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', // SMOOTH MOVEMENT
        cursor: onInteract ? 'context-menu' : 'default',
        pointerEvents: 'auto',
        zIndex: type === EntityType.Player ? 100 : 10
    };

    // RENDER LOGIC BASED ON TYPE
    const renderModelParts = () => {
        switch (type) {
            case EntityType.Player:
                return (
                    <div className="animate-breathe w-full h-full transform-style-3d">
                        {/* Body */}
                        <Cube position={{x:0, y:0, z:0}} color={COLORS.KRAKEN_DARK} scale={{x:0.8, y:0.8, z:0.6}} />
                        {/* Head */}
                        <Cube position={{x:0, y:0, z:0.7}} color={COLORS.KRAKEN_GREEN} scale={{x:1, y:1, z:0.8}} />
                        {/* Eyes/Bandana */}
                        <Cube position={{x:0.3, y:0, z:0.9}} color="#111827" scale={{x:0.5, y:0.8, z:0.2}} />
                        <Cube position={{x:0.35, y:-0.2, z:0.9}} color="#ffffff" scale={{x:0.1, y:0.1, z:0.1}} className="animate-pulse" />
                        <Cube position={{x:0.35, y:0.2, z:0.9}} color="#ffffff" scale={{x:0.1, y:0.1, z:0.1}} className="animate-pulse" />
                    </div>
                );
            case EntityType.Resource:
                return (
                    <div className="animate-float w-full h-full transform-style-3d">
                        {/* Core Crystal */}
                        <Cube position={{x:0, y:0, z:0.2}} color={color} scale={{x:0.6, y:0.6, z:0.6}} opacity={0.8} />
                        {/* Orbiting bits */}
                        <Cube position={{x:0, y:0, z:0.8}} color="#ffffff" scale={{x:0.2, y:0.2, z:0.2}} className="animate-spin-slow" />
                        {label && <Cube position={{x:0, y:0, z:1.2}} color="#000000" scale={{x:1, y:0.3, z:0.1}} label={label} opacity={0.6} />}
                    </div>
                );
            case EntityType.Obstacle:
                 if (label === 'BUG' || label?.includes('bug')) {
                     return (
                        <div className="animate-pulse-glow w-full h-full transform-style-3d">
                            <Cube position={{x:0, y:0, z:0}} color={COLORS.OBSTACLE_BUG} />
                            {/* Glitch cubes */}
                            <Cube position={{x:0.3, y:0.3, z:0.5}} color="#000000" scale={{x:0.3, y:0.3, z:0.3}} className="animate-ping" />
                            <Cube position={{x:-0.3, y:-0.2, z:0.2}} color="#ef4444" scale={{x:0.2, y:0.2, z:0.2}} />
                        </div>
                     )
                 }
                 // Default Obstacle / Void
                 return <Cube position={{x:0, y:0, z:0}} color={color} />;
            
            case EntityType.Goal:
                return (
                    <div className="animate-bounce-slight w-full h-full transform-style-3d">
                        <Cube position={{x:0, y:0, z:0}} color="#fbbf24" opacity={0.5} />
                        <Cube position={{x:0, y:0, z:0.5}} color="#fbbf24" scale={{x:0.5, y:0.5, z:1.5}} />
                        <Cube position={{x:0, y:0, z:1.5}} color="#ffffff" scale={{x:0.8, y:0.1, z:0.5}} label={label} />
                    </div>
                )

            case EntityType.Block:
            default:
                // Standard Ground Block
                return <Cube position={{x:0, y:0, z:0}} color={color} label={label} />;
        }
    };

    return (
        <div style={wrapperStyle} onContextMenu={handleContextMenu}>
            {renderModelParts()}
        </div>
    );
});

// ---- PARTICLES & FX ----

const ParticleEffect: React.FC<{ particle: Particle, size?: number }> = ({ particle, size=50 }) => {
    const xPos = particle.x * size;
    const yPos = particle.y * size;
    const zPos = particle.z * size;

    return (
        <div 
            style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                backgroundColor: particle.color,
                transform: `translateX(${xPos}px) translateY(${yPos}px) translateZ(${zPos}px)`,
                opacity: particle.life,
                boxShadow: `0 0 8px ${particle.color}`,
                pointerEvents: 'none',
                borderRadius: '50%'
            }}
        />
    )
}

const GuideArrow: React.FC<{ position: Vector3, size?: number }> = ({ position, size = 50 }) => {
    return (
        <div 
            style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                transformStyle: 'preserve-3d',
                transform: `translateX(${position.x * size}px) translateY(${position.y * size}px) translateZ(${(position.z + 1.5) * size}px)`,
                pointerEvents: 'none',
            }}
            className="animate-bounce-arrow"
        >
             <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 mx-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
        </div>
    );
}

// ---- MAIN SCENE ----

interface SceneProps {
  entities: VoxelEntity[];
  playerPos: Vector3;
  tutorialTarget?: Vector3;
  shakeIntensity: number;
  particles: Particle[];
  onInteract: (id: string, type?: EntityType, label?: string) => void;
  rotation?: number; 
}

export const GameScene: React.FC<SceneProps> = ({ entities, playerPos, tutorialTarget, shakeIntensity, particles, onInteract }) => {
  
  // Interactive Camera State
  const [rotX, setRotX] = useState(60);
  const [rotZ, setRotZ] = useState(-45);
  const [zoom, setZoom] = useState(0.8);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Camera Shake
  const shakeX = shakeIntensity > 0 ? (Math.random() - 0.5) * 20 * shakeIntensity : 0;
  const shakeY = shakeIntensity > 0 ? (Math.random() - 0.5) * 20 * shakeIntensity : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
      // Right click is interact, Left click is rotate
      if (e.button === 0) {
          isDragging.current = true;
          lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      setRotZ(prev => prev - deltaX * 0.5); // Drag horizontal rotates Z (orbit)
      setRotX(prev => Math.max(10, Math.min(85, prev + deltaY * 0.5))); // Drag vertical tilts X

      lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
      isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
      const delta = e.deltaY * -0.001;
      setZoom(prev => Math.min(2.0, Math.max(0.3, prev + delta)));
  };

  useEffect(() => {
      const handleGlobalUp = () => isDragging.current = false;
      window.addEventListener('mouseup', handleGlobalUp);
      return () => window.removeEventListener('mouseup', handleGlobalUp);
  }, []);

  return (
    <div 
        className="w-full h-full overflow-hidden relative flex items-center justify-center perspective-container bg-transparent cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
    >
      {/* Camera Container */}
      <div 
        className="relative transform-style-3d transition-transform duration-75 ease-out"
        style={{
          transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${zoom}) translateX(${shakeX}px) translateY(${shakeY}px)`,
          width: '0px',
          height: '0px',
        }}
      >
        {/* Render World Entities (Map) */}
        {entities.map((entity) => {
            if (entity.isHidden) return null;
            return (
                <VoxelModel
                    key={entity.id}
                    id={entity.id}
                    entity={entity}
                    onInteract={onInteract}
                />
            );
        })}

        {/* Render Player (Keif) - FIXED: Use stable key to allow CSS transition */}
        <VoxelModel 
            key="player-keif"
            id="player-keif"
            entity={{
                id: 'player-keif',
                type: EntityType.Player,
                position: playerPos,
                color: COLORS.KRAKEN_GREEN
            }}
        />

        {/* Render Tutorial Guide Arrow */}
        {tutorialTarget && <GuideArrow position={tutorialTarget} />}
        
        {/* Render Particles */}
        {particles.map(p => <ParticleEffect key={p.id} particle={p} />)}

      </div>
      
      <style>{`
        .perspective-container { perspective: 1200px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
};
