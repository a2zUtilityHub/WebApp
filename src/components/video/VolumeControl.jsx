import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const VolumeControl = ({ volume, onChange }) => {
  const handleToggleMute = () => {
    onChange(volume === 0 ? 100 : 0);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleToggleMute} className="text-muted-foreground hover:text-primary transition-colors">
        {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <div className="w-24">
        <Slider
          min={0}
          max={100}
          step={1}
          value={[volume]}
          onValueChange={(val) => onChange(val[0])}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{volume}%</span>
    </div>
  );
};

export default VolumeControl;