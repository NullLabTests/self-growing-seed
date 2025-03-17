
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, PauseIcon, PlayIcon, ZapIcon, BrainCircuitIcon, Sparkles, Code } from 'lucide-react';
import { SeedState } from '@/utils/seedGrowth';
import { playClickSound } from '@/utils/soundEffects';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  seed: SeedState;
  isEvolving: boolean;
  speed: number;
  messages: string[];
  toggleEvolution: () => void;
  adjustSpeed: (speed: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  seed,
  isEvolving,
  speed,
  messages,
  toggleEvolution,
  adjustSpeed,
}) => {
  // Calculate stats for display
  const complexity = Math.round(seed.complexity * 10) / 10;
  const nodeCount = Object.keys(seed.nodes).length;
  const connectionCount = seed.connections.length;
  const averageKnowledge = Object.values(seed.nodes).reduce(
    (sum, node) => sum + node.knowledge, 0
  ) / nodeCount;
  
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Update the time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle button click with sound
  const handleToggle = () => {
    playClickSound();
    toggleEvolution();
  };
  
  // Handle slider change with sound
  const handleSpeedChange = (value: number[]) => {
    playClickSound();
    adjustSpeed(value[0]);
  };
  
  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="glassmorphism terminal-window flex-shrink-0 animate-slide-up matrix-effect">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center">
            <Terminal className="h-4 w-4 text-primary mr-2" />
            <CardTitle className="text-sm font-mono tracking-tight text-primary">RSI-SEED-v1.0</CardTitle>
          </div>
          <div className="text-xs text-primary/70 font-mono">{currentTime}</div>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="terminal-header text-lg">Self-Evolving AI</h2>
              <div className="text-xs terminal-text flex items-center">
                <span className="text-primary/70 mr-1">GEN:</span>
                <span className="text-primary">{seed.generation}</span>
                <span className="mx-2 text-primary/50">|</span>
                <span className="text-primary/70 mr-1">NODES:</span>
                <span className="text-primary">{nodeCount}</span>
              </div>
            </div>
            <Button
              onClick={handleToggle}
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md border-primary/50 bg-background/30 hover:bg-primary/20"
            >
              {isEvolving ? <PauseIcon size={16} className="text-primary" /> : <PlayIcon size={16} className="text-primary" />}
            </Button>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-primary/80">COMPLEXITY</label>
                <span className="text-xs font-mono text-primary">{complexity}</span>
              </div>
              <Progress value={Math.min(100, (complexity / 20) * 100)} className="h-1.5 bg-background/50" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-primary/80">KNOWLEDGE</label>
                <span className="text-xs font-mono text-primary">{Math.round(averageKnowledge * 100)}%</span>
              </div>
              <Progress value={averageKnowledge * 100} className="h-1.5 bg-background/50" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-primary/80">GROWTH RATE</label>
                <span className="text-xs font-mono text-primary">{speed}x</span>
              </div>
              <Slider
                value={[speed]}
                min={0.5}
                max={3}
                step={0.5}
                onValueChange={handleSpeedChange}
                className="h-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glassmorphism terminal-window flex-1 animate-slide-up matrix-effect">
        <CardHeader className="py-2 px-3 border-b border-primary/30 flex flex-row items-center space-y-0">
          <Sparkles size={14} className="text-primary mr-2" />
          <CardTitle className="text-xs font-mono text-primary">ACTIVITY LOG</CardTitle>
        </CardHeader>
        <CardContent className="p-3 h-full overflow-hidden">
          <div className="space-y-2 max-h-[calc(100%-1rem)] overflow-y-auto pr-1 font-mono text-xs">
            {messages.length === 0 ? (
              <p className="text-primary/50 italic">
                [SYSTEM] Awaiting initialization sequence...
              </p>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-2 border-l-2 border-primary/50 animate-fade-in",
                    index === 0 ? "bg-primary/10" : "bg-background/20"
                  )}
                >
                  <p className="text-primary/90">
                    {message.includes("Evolved") ? (
                      <span className="text-seed-accent">[EVOLUTION]</span>
                    ) : message.includes("Learning") ? (
                      <span className="text-seed-info">[LEARNING]</span>
                    ) : (
                      <span className="text-primary/70">[SYSTEM]</span>
                    )} {message}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-2 flex justify-between items-center">
        <Badge variant="outline" className="rounded-sm py-1 px-2 text-xs bg-background/20 border-primary/30 text-primary/90 font-mono">
          <Code size={10} className="mr-1" />
          RSI-CAPABLE
        </Badge>
        <Badge variant="outline" className="rounded-sm py-1 px-2 text-xs bg-background/20 border-primary/30 text-primary/90 font-mono">
          <ZapIcon size={10} className="mr-1" />
          SELF-IMPROVING
        </Badge>
      </div>
    </div>
  );
};

export default ControlPanel;
