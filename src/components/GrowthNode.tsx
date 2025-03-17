
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
    const baseColor = 'rgb(144, 205, 244)'; // Default light blue
    
    if (node.id === 'core') {
      return baseColor;
    }
    
    // More knowledge = more opacity and brighter color
    const opacity = 0.3 + node.knowledge * 0.7;
    return `rgba(144, 205, 244, ${opacity})`;
  };
  
  // Calculate glow effect based on activity and knowledge
  const getGlowEffect = () => {
    if (node.id === 'core') {
      return '0 0 30px rgba(144, 205, 244, 0.7)';
    }
    
    if (node.active) {
      return `0 0 ${15 + node.knowledge * 10}px rgba(144, 205, 244, ${0.3 + node.knowledge * 0.4})`;
    }
    
    if (isHighlighted) {
      return `0 0 15px rgba(144, 205, 244, 0.3)`;
    }
    
    return 'none';
  };
  
  return (
    <div 
      className={cn(
        "growth-node absolute transition-all rounded-full cursor-pointer",
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
        transition: isNew ? 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 0.3s ease',
        transform: `translate(-50%, -50%) ${visible ? 'scale(1)' : 'scale(0)'}`,
      }}
      onClick={onClick}
    />
  );
};

export default GrowthNode;
