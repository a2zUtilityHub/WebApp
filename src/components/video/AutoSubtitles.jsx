
import React, { useState } from 'react';
import { Subtitles as Captions, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';
import FeatureStatus from './FeatureStatus';

const AutoSubtitles = () => {
  const { aiFeatures, updateAIFeature, totalDuration } = useVideoContext();
  const { enabled, processing, data } = aiFeatures.subtitles;
  const { toast } = useToast();
  const [error, setError] = useState(null);

  const handleGenerate = () => {
    updateAIFeature('subtitles', { processing: true });
    setError(null);
    
    // Simulate STT processing since Web Speech API needs live mic usually
    // or requires streaming the video audio buffer, which is complex for a mock.
    setTimeout(() => {
      const mockData = [];
      let current = 0;
      while (current < totalDuration) {
        mockData.push({
          id: Math.random().toString(),
          text: `Simulated speech at ${Math.floor(current)}s...`,
          startTime: current,
          endTime: Math.min(current + 2, totalDuration)
        });
        current += 3;
      }
      
      updateAIFeature('subtitles', { processing: false, enabled: true, data: mockData });
      toast({ title: "Subtitles Generated", description: "Auto-subtitles have been applied." });
    }, 2000);
  };

  const handleToggle = (checked) => {
    updateAIFeature('subtitles', { enabled: checked });
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Captions className="w-4 h-4 text-primary" /> Auto Subtitles
        </h3>
        <Switch checked={enabled} onCheckedChange={handleToggle} disabled={processing || data.length === 0} />
      </div>

      <p className="text-xs text-muted-foreground">
        Automatically generate subtitles using speech recognition.
      </p>

      <Button onClick={handleGenerate} disabled={processing} size="sm" className="w-full">
        <Wand2 className="w-4 h-4 mr-2" /> Generate Subtitles
      </Button>

      <FeatureStatus featureName="Subtitles" processing={processing} enabled={enabled} error={error} />
      
      {data.length > 0 && enabled && (
        <div className="max-h-32 overflow-y-auto mt-2 space-y-2 text-xs border border-border rounded p-2 bg-background">
          {data.map((sub, i) => (
            <div key={sub.id} className="p-1 border-b border-border/50 last:border-0">
               <span className="text-muted-foreground mr-2 font-mono">[{Math.round(sub.startTime)}s]</span>
               {sub.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoSubtitles;
