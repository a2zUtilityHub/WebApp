import React, { useState } from 'react';
import { MicOff, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';
import FeatureStatus from './FeatureStatus';

const NoiseRemoval = () => {
  const { aiFeatures, updateAIFeature } = useVideoContext();
  const { enabled, processing, intensity } = aiFeatures.noiseRemoval;
  const { toast } = useToast();
  const [error, setError] = useState(null);

  const handleApply = () => {
    updateAIFeature('noiseRemoval', { processing: true });
    setError(null);
    
    // Simulate analysis and application
    setTimeout(() => {
      updateAIFeature('noiseRemoval', { processing: false, enabled: true });
      toast({ title: "Noise Removal Applied", description: `Background noise reduced (Intensity: ${intensity}%).` });
    }, 1500);
  };

  const handleToggle = (checked) => {
    updateAIFeature('noiseRemoval', { enabled: checked });
  };

  const handleIntensityChange = (val) => {
    updateAIFeature('noiseRemoval', { intensity: val[0] });
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <MicOff className="w-4 h-4 text-primary" /> Noise Removal
        </h3>
        <Switch checked={enabled} onCheckedChange={handleToggle} disabled={processing} />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span>Intensity</span>
          <span>{intensity}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[intensity]}
          onValueChange={handleIntensityChange}
          disabled={!enabled && !processing}
        />
      </div>

      <Button onClick={handleApply} disabled={processing} size="sm" variant="outline" className="w-full mt-2">
        <SlidersHorizontal className="w-4 h-4 mr-2" /> Apply Filter
      </Button>

      <FeatureStatus featureName="Noise Filter" processing={processing} enabled={enabled} error={error} />
    </div>
  );
};

export default NoiseRemoval;