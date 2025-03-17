
import React, { useState, useEffect } from 'react';
import Seed from '@/components/Seed';
import ControlPanel from '@/components/ControlPanel';
import CodeEvolution from '@/components/CodeEvolution';
import MatrixBackground from '@/components/MatrixBackground';
import { useEvolution } from '@/hooks/useEvolution';
import { initAudio, playEvolutionSound, playNodeGrowthSound } from '@/utils/soundEffects';
import { cn } from '@/lib/utils';
import { Github, Terminal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const { 
    seed, 
    isEvolving, 
    speed, 
    messages, 
    toggleEvolution, 
    adjustSpeed, 
    activateNode,
    growthHistory 
  } = useEvolution(true, 1);

  // Previous generation for sound effect
  const [prevGeneration, setPrevGeneration] = useState(seed.generation);
  const [prevGrowthHistory, setPrevGrowthHistory] = useState<string[]>([]);

  // Animation state management
  useEffect(() => {
    setMounted(true);
    
    // Initialize audio on first interaction
    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleFirstInteraction);
    };
    
    window.addEventListener('click', handleFirstInteraction);
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);
  
  // Play evolution sound when generation changes
  useEffect(() => {
    if (mounted && seed.generation > prevGeneration) {
      playEvolutionSound();
      setPrevGeneration(seed.generation);
    }
  }, [seed.generation, prevGeneration, mounted]);
  
  // Play growth sound when new nodes are added
  useEffect(() => {
    if (mounted && growthHistory.length > prevGrowthHistory.length) {
      playNodeGrowthSound();
      setPrevGrowthHistory([...growthHistory]);
    }
  }, [growthHistory, prevGrowthHistory, mounted]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background">
      {/* Matrix background */}
      <MatrixBackground />
      
      {/* Header */}
      <header className={cn(
        "relative z-10 px-4 lg:px-8 py-4 transition-all duration-700 transform", 
        mounted ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      )}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-mono tracking-tight text-center flex items-center">
            <Terminal className="mr-2 h-5 w-5 text-primary" />
            <span className="text-foreground">Self-Growing</span>
            <span className="text-primary font-bold ml-2">Seed AI</span>
          </h1>
          
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-70 hover:opacity-100 transition-opacity">
                  <Info className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] glassmorphism terminal-window border-primary/30">
                <DialogHeader>
                  <DialogTitle className="terminal-header text-lg">
                    Recursive Self-Improvement AI
                  </DialogTitle>
                  <DialogDescription className="terminal-text text-primary/90">
                    A visualization of artificial general intelligence with recursive self-improvement capabilities.
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-primary/80 space-y-4 font-mono leading-relaxed">
                  <p>
                    Recursive Self-Improvement (RSI) is a hypothetical ability of artificial intelligence
                    systems to redesign themselves repeatedly, becoming progressively more intelligent
                    with each iteration.
                  </p>
                  <p>
                    The concept originated in I.J. Good's 1965 paper "Speculations Concerning the First
                    Ultraintelligent Machine," where he described an "intelligence explosion" resulting
                    from a machine's ability to improve its own intelligence.
                  </p>
                  <p>
                    This visualization simulates how a "seed AI" might evolve by forming new neural
                    connections, optimizing its architecture, and accumulating knowledge - all while
                    continuously improving its own improvement mechanisms.
                  </p>
                  <p>
                    Each node represents a knowledge cluster, while connections represent pathways
                    of information transfer. The growing network demonstrates how complexity emerges
                    from simple initial conditions through iterative improvement.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          
            <a 
              href="https://github.com/yourusername/seed-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch w-full max-w-7xl mx-auto px-4 lg:px-8 pb-8 gap-6">
        {/* Seed Visualization */}
        <div className={cn(
          "flex-1 relative min-h-[400px] lg:min-h-[600px] rounded-md overflow-hidden terminal-window", 
          mounted ? "opacity-100" : "opacity-0"
        )}>
          <Seed seed={seed} onNodeClick={activateNode} growthHistory={growthHistory} />
        </div>

        {/* Right Panel (Control & Code) */}
        <div className={cn(
          "w-full lg:w-96 flex flex-col gap-6 transition-all duration-1000 transform",
          mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        )}>
          {/* Control Panel */}
          <div className="flex-1">
            <ControlPanel
              seed={seed}
              isEvolving={isEvolving}
              speed={speed}
              messages={messages}
              toggleEvolution={toggleEvolution}
              adjustSpeed={adjustSpeed}
            />
          </div>
          
          {/* Code Evolution Panel */}
          <div className="h-[300px]">
            <CodeEvolution 
              isEvolving={isEvolving}
              complexity={seed.complexity}
              generation={seed.generation}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "py-4 text-center text-xs font-mono text-primary/50 transition-all duration-1000",
        mounted ? "opacity-70" : "opacity-0"
      )}>
        <p>Visualizing recursive self-improvement • Generation {seed.generation} • Nodes: {Object.keys(seed.nodes).length}</p>
      </footer>
    </div>
  );
};

export default Index;
