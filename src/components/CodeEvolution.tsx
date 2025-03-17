
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Simplified programming patterns for display
const codePatterns = [
  `function optimizeNetwork(nodes) {
  return nodes.filter(n => n.efficiency > 0.7);
}`,
  `class NeuralPathway {
  constructor(sourceNode, targetNode) {
    this.source = sourceNode;
    this.target = targetNode;
    this.weight = Math.random();
  }
  
  adjust(learningRate) {
    this.weight += learningRate * this.getGradient();
  }
}`,
  `const improveKnowledge = async (domain) => {
  const data = await fetchResources(domain);
  return processInformation(data);
}`,
  `// Enhance pattern recognition capability
function recognizePattern(input, existingPatterns) {
  const similarity = existingPatterns.map(
    pattern => calculateSimilarity(input, pattern)
  );
  return Math.max(...similarity);
}`,
  `class SelfImprovement {
  analyze() {
    const weakPoints = this.identifyWeaknesses();
    const improvements = this.generateImprovements(weakPoints);
    return this.implementChanges(improvements);
  }
}`,
  `function optimizeDecisionTree(tree) {
  const pruned = removeRedundantBranches(tree);
  return balanceNodes(pruned);
}`,
  `// Recursively enhance reasoning module
const enhanceReasoning = (currentModule) => {
  if (currentModule.performance > 0.95) return currentModule;
  
  const improved = {...currentModule};
  improved.logic = refineLogic(currentModule.logic);
  improved.performance = evaluatePerformance(improved);
  
  return enhanceReasoning(improved);
}`,
  `async function synthesizeKnowledge(domains) {
  const knowledgeBases = await Promise.all(
    domains.map(d => fetchDomainKnowledge(d))
  );
  
  return createCrossConnections(knowledgeBases);
}`
];

interface CodeEvolutionProps {
  isEvolving: boolean;
  complexity: number;
  generation: number;
}

const CodeEvolution: React.FC<CodeEvolutionProps> = ({ 
  isEvolving, 
  complexity,
  generation
}) => {
  const [currentCode, setCurrentCode] = useState(codePatterns[0]);
  const [visibleCode, setVisibleCode] = useState("");
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [charIndex, setCharIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);
  
  // Function to generate new code based on complexity
  useEffect(() => {
    if (!isEvolving) return;
    
    const interval = setInterval(() => {
      // Get a random code pattern, weighted by complexity
      const patternIndex = Math.min(
        Math.floor(Math.random() * (complexity / 3)), 
        codePatterns.length - 1
      );
      
      // Get base code
      let newCode = codePatterns[patternIndex];
      
      // As complexity increases, add random modifications
      if (complexity > 5) {
        // Add complexity indicators
        const lines = newCode.split('\n');
        const randomLineIndex = Math.floor(Math.random() * lines.length);
        
        if (complexity > 10 && Math.random() > 0.7) {
          // Add optimization comment
          lines.splice(randomLineIndex, 0, `  // Optimizing for generation ${generation}`);
        }
        
        if (complexity > 15 && Math.random() > 0.8) {
          // Add complexity tracking
          lines.splice(randomLineIndex, 0, `  // Complexity factor: ${complexity.toFixed(2)}`);
        }
        
        newCode = lines.join('\n');
      }
      
      setCurrentCode(newCode);
      setCodeHistory(prev => [...prev.slice(-4), newCode]);
      setCharIndex(0);
      setVisibleCode("");
    }, 10000 + (5000 / Math.max(complexity, 1))); // Slower at start, faster as complexity increases
    
    return () => clearInterval(interval);
  }, [isEvolving, complexity, generation]);
  
  // Type out code effect
  useEffect(() => {
    if (!isEvolving) return;
    
    const typingSpeed = 30; // ms per character
    
    if (charIndex < currentCode.length) {
      const timer = setTimeout(() => {
        setVisibleCode(prev => prev + currentCode.charAt(charIndex));
        setCharIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    }
  }, [currentCode, charIndex, isEvolving]);
  
  // Scroll to bottom when code changes
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  }, [visibleCode]);
  
  return (
    <Card className="terminal-window h-full flex flex-col matrix-effect">
      <CardHeader className="py-2 px-3 border-b border-primary/30 flex flex-row items-center space-y-0">
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-destructive/80" />
          <div className="w-3 h-3 rounded-full bg-accent/80" />
          <div className="w-3 h-3 rounded-full bg-primary/80" />
        </div>
        <CardTitle className="text-xs font-mono ml-2 text-primary/90">
          self-evolving-code.js - Generation {generation}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <pre 
          ref={codeRef}
          className="text-xs text-primary p-3 h-full overflow-y-auto font-mono"
        >
          {codeHistory.map((code, i) => (
            <div key={i} className="opacity-30 mb-4">
              {code}
            </div>
          ))}
          <div className="border-l-2 border-primary pl-2 text-primary/90">
            {visibleCode}
            {isEvolving && charIndex < currentCode.length && (
              <span className="cursor-blink"></span>
            )}
          </div>
        </pre>
      </CardContent>
    </Card>
  );
};

export default CodeEvolution;
