
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Node } from '@/utils/seedGrowth';

interface GrowthNodeProps {
  node: Node;
  onClick?: () => void;
  isHighlighted?: boolean;
  isNew?: boolean;
}

const GrowthNode: React.FC<GrowthNodeProps> = ({ 
  node, 
  onClick, 
  isHighlighted = false,
  isNew = false 
}) => {
  const [visible, setVisible] = useState(false);
  
  // Animate entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, isNew ? 100 : 0);
    
    return () => clearTimeout(timer);
  }, [isNew]);
  
  // Calculate colors based on node knowledge
  const getNodeColor = () => {
    if (node.id === 'core') {
      return 'rgba(144, 205, 244, 0.9)';
    }
    
    // More knowledge = more opacity and brighter color
    const opacity = 0.4 + node.knowledge * 0.6;
    
    // Use different colors based on node properties
    if (node.active) {
      return `rgba(124, 225, 254, ${opacity})`; // Bright cyan for active nodes
    }
    
    // Different color based on node depth
    const depth = node.connections.length;
    if (depth > 3) {
      return `rgba(160, 180, 255, ${opacity})`; // Purple-blue for deep nodes
    } else if (depth > 1) {
      return `rgba(144, 205, 244, ${opacity})`; // Default blue for medium nodes
    } else {
      return `rgba(120, 220, 232, ${opacity})`; // Teal for surface nodes
    }
  };
  
  // Calculate glow effect based on activity and knowledge
  const getGlowEffect = () => {
    if (node.id === 'core') {
      return '0 0 30px rgba(144, 205, 244, 0.8), 0 0 60px rgba(144, 205, 244, 0.4)';
    }
    
    if (node.active) {
      return `0 0 ${15 + node.knowledge * 15}px rgba(124, 225, 254, ${0.4 + node.knowledge * 0.5})`;
    }
    
    if (isHighlighted) {
      return `0 0 20px rgba(160, 180, 255, 0.6), 0 0 40px rgba(160, 180, 255, 0.2)`;
    }
    
    return 'none';
  };
  
  // Get border style
  const getBorder = () => {
    if (node.id === 'core') {
      return '1px solid rgba(255, 255, 255, 0.6)';
    }
    
    if (node.active) {
      return '1px solid rgba(255, 255, 255, 0.4)';
    }
    
    return 'none';
  };
  
  return (
    <div 
      className={cn(
        "growth-node absolute transition-all rounded-full cursor-pointer backdrop-blur-sm",
        node.id === 'core' ? 'seed-core animate-pulse-soft' : '',
        node.active ? 'z-10' : 'z-0',
        isNew && !visible ? 'opacity-0 scale-0' : 'opacity-100 scale-100',
        isHighlighted && 'animate-pulse-soft'
      )}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.size}px`,
        height: `${node.size}px`,
        backgroundColor: getNodeColor(),
        boxShadow: getGlowEffect(),
        border: getBorder(),
        transition: isNew ? 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 0.3s ease',
        transform: `translate(-50%, -50%) ${visible ? 'scale(1)' : 'scale(0)'}`,
      }}
      onClick={onClick}
    />
  );
};

export default GrowthNode;
