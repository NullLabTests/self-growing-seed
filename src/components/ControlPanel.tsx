
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PauseIcon, PlayIcon, ZapIcon, BrainCircuitIcon, Sparkles } from 'lucide-react';
import { SeedState } from '@/utils/seedGrowth';

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
  
  return (
    <div className="flex flex-col h-full glassmorphism rounded-lg p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Self-Evolving AI</h2>
          <p className="text-sm text-muted-foreground">Generation {seed.generation}</p>
        </div>
        <Button
          onClick={toggleEvolution}
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full"
        >
          {isEvolving ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
        </Button>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Complexity</label>
            <span className="text-sm text-muted-foreground">{complexity}</span>
          </div>
          <Progress value={Math.min(100, (complexity / 20) * 100)} className="h-2" />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Knowledge</label>
            <span className="text-sm text-muted-foreground">{Math.round(averageKnowledge * 100)}%</span>
          </div>
          <Progress value={averageKnowledge * 100} className="h-2" />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Growth Speed</label>
            <span className="text-sm text-muted-foreground">{speed}x</span>
          </div>
          <Slider
            value={[speed]}
            min={0.5}
            max={3}
            step={0.5}
            onValueChange={(value) => adjustSpeed(value[0])}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuitIcon size={16} className="text-primary/70" />
          <h3 className="text-sm font-medium">Network Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background/40 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Nodes</p>
            <p className="text-lg font-light">{nodeCount}</p>
          </div>
          <div className="bg-background/40 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Connections</p>
            <p className="text-lg font-light">{connectionCount}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-primary/70" />
          <h3 className="text-sm font-medium">Activity Log</h3>
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 text-sm">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-xs italic">
              No activity yet. Start the evolution to begin learning...
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="p-2 bg-background/40 rounded-md animate-fade-in">
                <p className="text-xs">{message}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <Badge variant="outline" className="rounded-full py-1 px-3 text-xs">
          <ZapIcon size={12} className="mr-1" />
          Self-Improving Seed
        </Badge>
      </div>
    </div>
  );
};

export default ControlPanel;
