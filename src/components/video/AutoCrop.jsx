
import React, { useState } from 'react';
import { Crop, ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';
import FeatureStatus from './FeatureStatus';

const AutoCrop = () => {
  const { aiFeatures, updateAIFeature } = useVideoContext();
  const { enabled, processing, aspectRatio } = aiFeatures.autoCrop;
  const { toast } = useToast();
  const [error, setError] = useState(null);

  const handleDetect = async () => {
    updateAIFeature('autoCrop', { processing: true });
    setError(null);
    
    try {
      // In a real app we'd use face-api.js here.
      // Mocking face detection processing:
      setTimeout(() => {
        updateAIFeature('autoCrop', { 
            processing: false, 
            enabled: true, 
            cropRegion: { x: 10, y: 10, w: 80, h: 80 } 
        });
        toast({ title: "Subject Detected", description: "Auto-crop region applied based on subject tracking." });
      }, 2000);
    } catch (err) {
      setError("Failed to detect subject.");
      updateAIFeature('autoCrop', { processing: false });
    }
  };

  const handleToggle = (checked) => {
    updateAIFeature('autoCrop', { enabled: checked });
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Crop className="w-4 h-4 text-primary" /> Auto Crop (AI)
        </h3>
        <Switch checked={enabled} onCheckedChange={handleToggle} disabled={processing} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex items-center gap-2">
            <input type="radio" name="ratio" checked={aspectRatio === '16:9'} onChange={() => updateAIFeature('autoCrop', { aspectRatio: '16:9'})} /> 16:9
        </label>
        <label className="flex items-center gap-2">
            <input type="radio" name="ratio" checked={aspectRatio === '9:16'} onChange={() => updateAIFeature('autoCrop', { aspectRatio: '9:16'})} /> 9:16
        </label>
        <label className="flex items-center gap-2">
            <input type="radio" name="ratio" checked={aspectRatio === '1:1'} onChange={() => updateAIFeature('autoCrop', { aspectRatio: '1:1'})} /> 1:1
        </label>
        <label className="flex items-center gap-2">
            <input type="radio" name="ratio" checked={aspectRatio === '4:3'} onChange={() => updateAIFeature('autoCrop', { aspectRatio: '4:3'})} /> 4:3
        </label>
      </div>

      <Button onClick={handleDetect} disabled={processing} size="sm" variant="outline" className="w-full">
        <ScanFace className="w-4 h-4 mr-2" /> Detect Subject
      </Button>

      <FeatureStatus featureName="Auto Crop" processing={processing} enabled={enabled} error={error} />
    </div>
  );
};

export default AutoCrop;
