
import React, { useRef } from 'react';
import { Music, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';

const AudioTrack = ({ onComplete }) => {
  const fileInputRef = useRef(null);
  const { addAudioTrack, playheadPosition } = useVideoContext();
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast({ title: "Invalid File", description: "Please upload an audio file.", variant: "destructive" });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "Audio files must be under 100MB.", variant: "destructive" });
      return;
    }

    // Get duration
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      addAudioTrack({
        file,
        duration: audio.duration,
        startTime: playheadPosition,
        volume: 100,
        type: 'music'
      });
      toast({ title: "Audio Added", description: "Background music added to timeline." });
      if (onComplete) onComplete();
    };
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
        <Music className="w-4 h-4 text-primary" /> Add Background Music
      </h3>
      
      <input 
        type="file" 
        accept="audio/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      <div 
        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Click to upload audio</p>
        <p className="text-xs text-muted-foreground mt-1">MP3, WAV, OGG (Max 100MB)</p>
      </div>
    </div>
  );
};

export default AudioTrack;
