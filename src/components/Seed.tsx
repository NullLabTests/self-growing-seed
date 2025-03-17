
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Update recent growth nodes
  useEffect(() => {
    if (growthHistory.length > 0) {
      const latestNode = growthHistory[growthHistory.length - 1];
      setRecentGrowth(prev => [...prev, latestNode].slice(-3));
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
    <div ref={containerRef} className="seed-container w-full h-full relative">
      {/* SVG layer for connections */}
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear' 
        }}
      >
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
              
            return (
              <line
                key={`${connection.source}-${connection.target}-${index}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className={isHighlighted ? 'node-line' : ''}
                stroke="rgba(144, 205, 244, 0.5)"
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Nodes layer */}
      <div 
        className="seed-sphere absolute inset-0"
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
