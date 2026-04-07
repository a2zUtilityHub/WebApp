import React from 'react';
import { Sparkles } from 'lucide-react';
import AutoSubtitles from './AutoSubtitles';
import NoiseRemoval from './NoiseRemoval';
import AutoCrop from './AutoCrop';
import ColorCorrection from './ColorCorrection';

const AIFeaturesPanel = () => {
  return (
    <div className="space-y-4 animate-fade-in pb-4">
      <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
        <Sparkles className="w-4 h-4" /> AI Enhancement Tools
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <AutoSubtitles />
        <ColorCorrection />
        <AutoCrop />
        <NoiseRemoval />
      </div>
    </div>
  );
};

export default AIFeaturesPanel;