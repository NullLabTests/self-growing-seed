
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Node } from '@/utils/seedGrowth';
import { playNodeActivationSound } from '@/utils/soundEffects';

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
  const [animating, setAnimating] = useState(false);
  
  // Animate entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, isNew ? 100 : 0);
    
    return () => clearTimeout(timer);
  }, [isNew]);
  
  // Animate highlight
  useEffect(() => {
    if (isHighlighted) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);
  
  // Calculate colors based on node knowledge
  const getNodeColor = () => {
    if (node.id === 'core') {
      return 'rgba(120, 255, 120, 0.9)';
    }
    
    // More knowledge = more opacity and brighter color
    const opacity = 0.4 + node.knowledge * 0.6;
    
    // Use different colors based on node properties
    if (node.active) {
      return `rgba(120, 255, 120, ${opacity})`; // Bright green for active nodes
    }
    
    // Different color based on node depth
    const depth = node.connections.length;
    if (depth > 3) {
      return `rgba(240, 240, 85, ${opacity})`; // Yellow for deep nodes
    } else if (depth > 1) {
      return `rgba(120, 255, 120, ${opacity})`; // Default green for medium nodes
    } else {
      return `rgba(120, 220, 255, ${opacity})`; // Cyan for surface nodes
    }
  };
  
  // Calculate glow effect based on activity and knowledge
  const getGlowEffect = () => {
    if (node.id === 'core') {
      return '0 0 30px rgba(120, 255, 120, 0.8), 0 0 60px rgba(120, 255, 120, 0.4)';
    }
    
    if (node.active) {
      return `0 0 ${15 + node.knowledge * 20}px rgba(120, 255, 120, ${0.4 + node.knowledge * 0.5})`;
    }
    
    if (isHighlighted || animating) {
      return `0 0 20px rgba(120, 255, 120, 0.6), 0 0 40px rgba(120, 255, 120, 0.3)`;
    }
    
    return `0 0 ${5 + node.knowledge * 10}px rgba(120, 255, 120, ${0.1 + node.knowledge * 0.2})`;
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
  
  // Handle click with sound
  const handleClick = () => {
    playNodeActivationSound();
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={cn(
        "growth-node absolute transition-all rounded-full cursor-pointer backdrop-blur-sm",
        node.id === 'core' ? 'seed-core animate-pulse-soft' : '',
        node.active ? 'z-10 node-active' : 'z-0',
        isNew && !visible ? 'opacity-0 scale-0' : 'opacity-100',
        isHighlighted && 'animate-pulse-soft',
        animating && 'animate-glitch'
      )}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.size}px`,
        height: `${node.size}px`,
        backgroundColor: getNodeColor(),
        boxShadow: getGlowEffect(),
        border: getBorder(),
        transform: `translate(-50%, -50%) ${visible ? 'scale(1)' : 'scale(0)'}`,
      }}
      onClick={handleClick}
    />
  );
};

export default GrowthNode;
