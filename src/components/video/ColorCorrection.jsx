
import React, { useState } from 'react';
import { Palette, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useVideoContext } from '@/contexts/VideoContext';
import FeatureStatus from './FeatureStatus';

const ColorCorrection = () => {
  const { aiFeatures, updateAIFeature } = useVideoContext();
  const { enabled, processing, brightness, contrast, saturation } = aiFeatures.colorCorrection;

  const handleToggle = (checked) => {
    updateAIFeature('colorCorrection', { enabled: checked });
  };

  const handleReset = () => {
    updateAIFeature('colorCorrection', { brightness: 0, contrast: 0, saturation: 0 });
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" /> Color Correction
        </h3>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Brightness</span>
            <span>{brightness}</span>
          </div>
          <Slider min={-100} max={100} step={1} value={[brightness]} onValueChange={(v) => updateAIFeature('colorCorrection', { brightness: v[0] })} disabled={!enabled} />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Contrast</span>
            <span>{contrast}</span>
          </div>
          <Slider min={-100} max={100} step={1} value={[contrast]} onValueChange={(v) => updateAIFeature('colorCorrection', { contrast: v[0] })} disabled={!enabled} />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Saturation</span>
            <span>{saturation}</span>
          </div>
          <Slider min={-100} max={100} step={1} value={[saturation]} onValueChange={(v) => updateAIFeature('colorCorrection', { saturation: v[0] })} disabled={!enabled} />
        </div>
      </div>

      <Button onClick={handleReset} size="sm" variant="ghost" className="w-full text-muted-foreground hover:text-foreground mt-2">
        <RefreshCcw className="w-4 h-4 mr-2" /> Reset Defaults
      </Button>

      <FeatureStatus featureName="Color Adjustments" processing={processing} enabled={enabled} />
    </div>
  );
};

export default ColorCorrection;
