
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SeedState, 
  createInitialSeed, 
  evolveSeed, 
  growNewNode, 
  activateNode,
  findGrowthCandidates 
} from '../utils/seedGrowth';

// Deep learning concepts that the AI is "learning"
const learningConcepts = [
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
  "Uncertainty handling",
  "Attention mechanism tuning",
  "Transformative learning",
  "Self-reference mechanism",
  "Abstraction hierarchy mapping",
  "Generative modeling",
  "Multi-modal integration",
  "Recursive improvement optimization",
  "Causal reasoning improvement",
  "Transfer learning capabilities",
  "Meta-learning strategies"
];

// Evolution strategies that the AI employs
const evolutionStrategies = [
  "Neural architecture search",
  "Weight optimization",
  "Hyperparameter tuning",
  "Topology adaptation",
  "Connection pruning",
  "Bias correction",
  "Gradient flow enhancement",
  "Activation function optimization",
  "Resource allocation optimization",
  "Error backpropagation refinement",
  "Knowledge transfer protocols",
  "Memory indexing improvement",
  "Self-analysis routines",
  "Redundancy elimination",
  "Cross-domain knowledge integration"
];

// Code patterns that evolve
const codePatterns = {
  basic: [
    "function improve() { return increaseCapability(); }",
    "let improvement = current => current * 1.1;",
    "class KnowledgeNode { constructor() { this.connections = []; } }"
  ],
  intermediate: [
    "const optimizeLearning = (rate, data) => {\n  return data.map(d => d * rate);\n};",
    "function neuralUpdate(weights, inputs) {\n  return weights.map((w, i) => w * inputs[i]);\n}",
    "class SelfImprovement {\n  analyze() { /* implementation */ }\n  optimize() { /* implementation */ }\n}"
  ],
  advanced: [
    "async function recursiveEnhancement(model) {\n  const analysis = await analyzeLimitations(model);\n  const improvements = generateImprovements(analysis);\n  return implementImprovements(model, improvements);\n}",
    "class MetaLearning {\n  constructor(initialModel) {\n    this.model = initialModel;\n    this.history = [];\n    this.optimizers = this.generateOptimizers();\n  }\n\n  async evolve(iterations = 1) { /* implementation */ }\n}",
    "function selfModification(codeBase) {\n  const weakPoints = identifyWeakPoints(codeBase);\n  const optimizations = generateOptimizations(weakPoints);\n  return applyOptimizations(codeBase, optimizations);\n}"
  ]
};

export const useEvolution = (autoEvolve = true, growthSpeed = 1) => {
  // Main seed state
  const [seed, setSeed] = useState<SeedState>(createInitialSeed());
  
  // Evolution speed/configuration
  const [isEvolving, setIsEvolving] = useState(autoEvolve);
  const [speed, setSpeed] = useState(growthSpeed);
  
  // Growth history for visualization
  const [growthHistory, setGrowthHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  
  // Code evolution state
  const [codeEvolution, setCodeEvolution] = useState({
    currentLevel: 'basic',
    iterations: 0,
    codeBase: codePatterns.basic.join('\n\n')
  });
  
  // Refs for the intervals
  const evolutionIntervalRef = useRef<number | null>(null);
  const growthIntervalRef = useRef<number | null>(null);
  const codeEvolutionIntervalRef = useRef<number | null>(null);
  
  // Add a message to the log
  const addMessage = useCallback((message: string) => {
    setMessages(prev => [message, ...prev].slice(0, 10));
  }, []);
  
  // Handle a single evolution step
  const evolveStep = useCallback(() => {
    setSeed(prevSeed => {
      const shouldEvolve = 
        prevSeed.complexity > 2 && 
        Date.now() - prevSeed.lastEvolution > 15000 / speed;
        
      if (shouldEvolve) {
        const evolved = evolveSeed(prevSeed);
        
        // Select a random evolution strategy
        const strategy = evolutionStrategies[Math.floor(Math.random() * evolutionStrategies.length)];
        
        // Add an evolution message
        addMessage(`Evolved to generation ${evolved.generation} using ${strategy}`);
        
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
      const learningTopic = learningConcepts[Math.floor(Math.random() * learningConcepts.length)];
      const proficiency = Math.floor(Math.random() * 100);
      addMessage(`Learning: ${learningTopic} (${proficiency}% proficiency)`);
      
      return newSeed;
    });
  }, [addMessage]);
  
  // Handle code evolution (this is actual code that evolves)
  const evolveCode = useCallback(() => {
    setCodeEvolution(prev => {
      const newIterations = prev.iterations + 1;
      
      // Determine current evolution level based on iterations
      let newLevel = prev.currentLevel;
      if (newIterations > 15) {
        newLevel = 'advanced';
      } else if (newIterations > 5) {
        newLevel = 'intermediate';
      }
      
      // Get code patterns for the current level
      const availablePatterns = codePatterns[newLevel as keyof typeof codePatterns];
      
      // Generate new code by combining patterns
      const randomPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
      
      // Add a code evolution message if level has changed
      if (newLevel !== prev.currentLevel) {
        addMessage(`Code evolved to ${newLevel} level - implementing new algorithms`);
      }
      
      return {
        currentLevel: newLevel,
        iterations: newIterations,
        codeBase: randomPattern
      };
    });
  }, [addMessage]);
  
  // Set up the evolution and growth intervals
  useEffect(() => {
    if (isEvolving) {
      // Clear any existing intervals
      if (evolutionIntervalRef.current) window.clearInterval(evolutionIntervalRef.current);
      if (growthIntervalRef.current) window.clearInterval(growthIntervalRef.current);
      if (codeEvolutionIntervalRef.current) window.clearInterval(codeEvolutionIntervalRef.current);
      
      // Set up new intervals with adjusted speeds
      evolutionIntervalRef.current = window.setInterval(evolveStep, 3000 / speed);
      growthIntervalRef.current = window.setInterval(growStep, 5000 / speed);
      codeEvolutionIntervalRef.current = window.setInterval(evolveCode, 8000 / speed);
      
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
      
      if (codeEvolutionIntervalRef.current) {
        window.clearInterval(codeEvolutionIntervalRef.current);
        codeEvolutionIntervalRef.current = null;
      }
    }
    
    // Clean up intervals on unmount
    return () => {
      if (evolutionIntervalRef.current) window.clearInterval(evolutionIntervalRef.current);
      if (growthIntervalRef.current) window.clearInterval(growthIntervalRef.current);
      if (codeEvolutionIntervalRef.current) window.clearInterval(codeEvolutionIntervalRef.current);
    };
  }, [isEvolving, speed, evolveStep, growStep, evolveCode, addMessage]);
  
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
    growthHistory,
    codeEvolution
  };
};
