
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SeedState, 
  createInitialSeed, 
  evolveSeed, 
  growNewNode, 
  activateNode,
  findGrowthCandidates 
} from '../utils/seedGrowth';

export const useEvolution = (autoEvolve = true, growthSpeed = 1) => {
  // Main seed state
  const [seed, setSeed] = useState<SeedState>(createInitialSeed());
  
  // Evolution speed/configuration
  const [isEvolving, setIsEvolving] = useState(autoEvolve);
  const [speed, setSpeed] = useState(growthSpeed);
  
  // Growth history for visualization
  const [growthHistory, setGrowthHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  
  // Refs for the intervals
  const evolutionIntervalRef = useRef<number | null>(null);
  const growthIntervalRef = useRef<number | null>(null);
  
  // List of learning topics that can be shown in messages
  const learningTopics = [
    "Natural language understanding",
    "Visual pattern recognition",
    "Logical reasoning frameworks",
    "Contextual data analysis",
    "Response optimization",
    "Decision tree refinement",
    "Neural pathway formation",
    "Semantic network expansion",
    "Knowledge embedding",
    "Feedback integration",
    "Pattern abstraction",
    "Cognitive framework adaptation",
    "Memory optimization",
    "Inference capability",
    "Conceptual mapping",
    "Prompt interpretation",
    "User interaction models",
    "Response synthesis",
    "Ethical consideration framework",
    "Uncertainty handling"
  ];
  
  // Add a message to the log
  const addMessage = useCallback((message: string) => {
    setMessages(prev => [message, ...prev].slice(0, 5));
  }, []);
  
  // Handle a single evolution step
  const evolveStep = useCallback(() => {
    setSeed(prevSeed => {
      const shouldEvolve = 
        prevSeed.complexity > 2 && 
        Date.now() - prevSeed.lastEvolution > 15000 / speed;
        
      if (shouldEvolve) {
        const evolved = evolveSeed(prevSeed);
        
        // Add an evolution message
        addMessage(`Evolved to generation ${evolved.generation} - complexity: ${evolved.complexity.toFixed(1)}`);
        
        return evolved;
      }
      
      return prevSeed;
    });
  }, [speed, addMessage]);
  
  // Handle growing a new node
  const growStep = useCallback(() => {
    setSeed(prevSeed => {
      // Find candidates for growth
      const candidates = findGrowthCandidates(prevSeed);
      
      if (candidates.length === 0) return prevSeed;
      
      // Choose a random candidate from the top options
      const sourceNodeId = candidates[Math.floor(Math.random() * candidates.length)];
      
      // Grow a new node from the selected source
      const newSeed = growNewNode(prevSeed, sourceNodeId, prevSeed.complexity);
      
      // Record the growth in history
      setGrowthHistory(prev => [...prev, sourceNodeId]);
      
      // Add a learning message
      const randomTopic = learningTopics[Math.floor(Math.random() * learningTopics.length)];
      addMessage(`Learning: ${randomTopic}`);
      
      return newSeed;
    });
  }, [addMessage]);
  
  // Set up the evolution and growth intervals
  useEffect(() => {
    if (isEvolving) {
      // Clear any existing intervals
      if (evolutionIntervalRef.current) window.clearInterval(evolutionIntervalRef.current);
      if (growthIntervalRef.current) window.clearInterval(growthIntervalRef.current);
      
      // Set up new intervals with adjusted speeds
      evolutionIntervalRef.current = window.setInterval(evolveStep, 3000 / speed);
      growthIntervalRef.current = window.setInterval(growStep, 5000 / speed);
      
      // Initial learning message
      addMessage("AI seed initialized - beginning learning process");
    } else {
      // Clear intervals when not evolving
      if (evolutionIntervalRef.current) {
        window.clearInterval(evolutionIntervalRef.current);
        evolutionIntervalRef.current = null;
      }
      
      if (growthIntervalRef.current) {
        window.clearInterval(growthIntervalRef.current);
        growthIntervalRef.current = null;
      }
    }
    
    // Clean up intervals on unmount
    return () => {
      if (evolutionIntervalRef.current) window.clearInterval(evolutionIntervalRef.current);
      if (growthIntervalRef.current) window.clearInterval(growthIntervalRef.current);
    };
  }, [isEvolving, speed, evolveStep, growStep, addMessage]);
  
  // Handle node activation
  const handleActivateNode = useCallback((nodeId: string) => {
    setSeed(prevSeed => activateNode(prevSeed, nodeId));
    
    // Add an interaction message
    const node = seed.nodes[nodeId];
    const knowledgeDesc = node ? 
      (node.knowledge > 0.7 ? "high" : node.knowledge > 0.4 ? "moderate" : "developing") :
      "unknown";
      
    addMessage(`Node ${nodeId} activated - ${knowledgeDesc} knowledge level`);
  }, [seed.nodes, addMessage]);
  
  // Toggle evolution state
  const toggleEvolution = useCallback(() => {
    setIsEvolving(prev => !prev);
  }, []);
  
  // Adjust evolution speed
  const adjustSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);
  
  // Public API
  return {
    seed,
    isEvolving,
    speed,
    messages,
    toggleEvolution,
    adjustSpeed,
    activateNode: handleActivateNode,
    growthHistory
  };
};
