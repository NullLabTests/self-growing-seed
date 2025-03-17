
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { SeedState } from '@/utils/seedGrowth';
import GrowthNode from './GrowthNode';

interface SeedProps {
  seed: SeedState;
  onNodeClick: (nodeId: string) => void;
  growthHistory: string[];
}

const Seed: React.FC<SeedProps> = ({ seed, onNodeClick, growthHistory }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerX, setCenterX] = useState(200);
  const [centerY, setCenterY] = useState(200);
  const [recentGrowth, setRecentGrowth] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [pulseEffect, setPulseEffect] = useState(false);
  
  // Update recent growth nodes with animation trigger
  useEffect(() => {
    if (growthHistory.length > 0) {
      const latestNode = growthHistory[growthHistory.length - 1];
      setRecentGrowth(prev => [...prev, latestNode].slice(-3));
      
      // Trigger pulse animation
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    }
  }, [growthHistory]);
  
  // Auto rotate the seed
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 0.05) % 360);
    }, 50);
    
    return () => clearInterval(rotateInterval);
  }, []);
  
  // Update center coordinates based on container size
  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCenterX(rect.width / 2);
        setCenterY(rect.height / 2);
      }
    };
    
    updateCenter();
    window.addEventListener('resize', updateCenter);
    
    return () => {
      window.removeEventListener('resize', updateCenter);
    };
  }, []);
  
  // Clear recent growth highlighting after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (recentGrowth.length > 0) {
        setRecentGrowth(prev => prev.slice(1));
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [recentGrowth]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn(
        "seed-container w-full h-full relative", 
        pulseEffect && "animate-pulse-soft"
      )}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-1 bg-primary/5 animate-terminal-scan" />
      </div>
      
      {/* Grid background */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="grid" 
            width="50" 
            height="50" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="rgba(120, 255, 120, 0.05)" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* SVG layer for connections */}
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full z-10" 
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear' 
        }}
      >
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <g transform={`translate(${centerX}, ${centerY})`}>
          {seed.connections.map((connection, index) => {
            const sourceNode = seed.nodes[connection.source];
            const targetNode = seed.nodes[connection.target];
            
            if (!sourceNode || !targetNode) return null;
            
            const isHighlighted = recentGrowth.includes(connection.source) || 
                                 recentGrowth.includes(connection.target);
                                 
            const strokeWidth = connection.source === 'core' || connection.target === 'core' 
              ? 2 
              : 1;
            
            const opacity = isHighlighted 
              ? 0.8
              : (0.2 + connection.strength * 0.4);

            // Different colors for different types of connections
            let strokeColor = "rgba(120, 255, 120, 0.5)"; // Default green
            
            if (sourceNode.connections.length > 3 || targetNode.connections.length > 3) {
              strokeColor = "rgba(240, 240, 85, 0.5)"; // Yellow for complex nodes
            } else if (connection.strength > 0.7) {
              strokeColor = "rgba(120, 220, 255, 0.5)"; // Cyan for strong connections
            }
              
            return (
              <line
                key={`${connection.source}-${connection.target}-${index}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className={isHighlighted ? 'node-line' : ''}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                filter={isHighlighted ? "url(#glow)" : ""}
                strokeDasharray={isHighlighted ? "0" : connection.strength < 0.5 ? "3,3" : "0"}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Nodes layer */}
      <div 
        className="seed-sphere absolute inset-0 z-20"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear' 
        }}
      >
        <div className="absolute inset-0" style={{ transform: `translate(${centerX}px, ${centerY}px)` }}>
          {Object.values(seed.nodes).map((node) => (
            <GrowthNode
              key={node.id}
              node={node}
              onClick={() => onNodeClick(node.id)}
              isHighlighted={recentGrowth.includes(node.id)}
              isNew={seed.nodes[node.id].createdAt > Date.now() - 5000}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Seed;
