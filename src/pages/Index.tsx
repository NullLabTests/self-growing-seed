
import React, { useState, useEffect } from 'react';
import Seed from '@/components/Seed';
import ControlPanel from '@/components/ControlPanel';
import { useEvolution } from '@/hooks/useEvolution';
import { cn } from '@/lib/utils';

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

  // Animation state management
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className={cn(
        "relative z-10 px-8 py-6 transition-all duration-700 transform", 
        mounted ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
      )}>
        <h1 className="text-3xl font-light tracking-tight text-center">
          Self-Growing <span className="text-primary font-normal">Seed AI</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-stretch w-full max-w-7xl mx-auto px-4 lg:px-8 pb-8 gap-6">
        {/* Seed Visualization */}
        <div className={cn(
          "flex-1 relative min-h-[400px] lg:min-h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-lg transition-all duration-1000", 
          mounted ? "opacity-100" : "opacity-0"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 rounded-xl" />
          <Seed seed={seed} onNodeClick={activateNode} growthHistory={growthHistory} />
        </div>

        {/* Control Panel */}
        <div className={cn(
          "w-full lg:w-80 transition-all duration-1000 transform",
          mounted ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        )}>
          <ControlPanel
            seed={seed}
            isEvolving={isEvolving}
            speed={speed}
            messages={messages}
            toggleEvolution={toggleEvolution}
            adjustSpeed={adjustSpeed}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "py-4 text-center text-xs text-muted-foreground transition-all duration-1000",
        mounted ? "opacity-70" : "opacity-0"
      )}>
        <p>Visualizing recursive self-improvement - Generation {seed.generation}</p>
      </footer>
    </div>
  );
};

export default Index;
