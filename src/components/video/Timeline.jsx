
import React, { useRef, useState, useEffect } from 'react';
import { useVideoContext } from '@/contexts/VideoContext';
import { formatDuration } from '@/lib/VideoMetadataExtractor';
import { Scissors, Trash2 } from 'lucide-react';
import VolumeControl from './VolumeControl';

// Sub-components to prevent Vite resolution errors from spreading files
const ClipHandle = ({ onDrag }) => (
  <div 
    className="absolute top-0 bottom-0 w-2 bg-black/20 hover:bg-black/40 cursor-ew-resize z-10 transition-colors flex items-center justify-center"
    onMouseDown={(e) => { e.stopPropagation(); onDrag(e); }}
  >
    <div className="w-0.5 h-4 bg-white rounded-full"></div>
  </div>
);

const TimelineClip = ({ clip, pxPerSec }) => {
  const { removeClip, updateClip } = useVideoContext();
  const width = clip.duration * pxPerSec;
  const left = clip.startTime * pxPerSec; // Note: In a real linear timeline, start time determines left position

  return (
    <div 
      className="absolute top-1 bottom-1 bg-primary/80 rounded-md border border-primary overflow-hidden shadow-sm group"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-2 py-1 text-[10px] text-white font-medium truncate flex justify-between items-center h-full">
        <span className="truncate">{clip.file.name}</span>
        <div className="hidden group-hover:flex items-center gap-1 bg-black/50 p-1 rounded">
          <button onClick={() => removeClip(clip.id)} className="hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
        </div>
      </div>
      {/* Visual handles for future resize implementation */}
      <ClipHandle onDrag={() => {}} />
      <ClipHandle onDrag={() => {}} />
    </div>
  );
};

const AudioClip = ({ track, pxPerSec }) => {
  const { removeAudioTrack, updateAudioVolume } = useVideoContext();
  const width = track.duration * pxPerSec;
  const left = track.startTime * pxPerSec;

  return (
    <div 
      className="absolute top-1 bottom-1 bg-blue-500/80 rounded-md border border-blue-600 overflow-hidden shadow-sm group"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-2 py-1 text-[10px] text-white font-medium flex justify-between items-center h-full">
        <span className="truncate">{track.type === 'voiceover' ? 'Voiceover' : track.file.name}</span>
        <div className="hidden group-hover:flex items-center gap-2 bg-black/50 p-1 rounded">
          <VolumeControl volume={track.volume} onChange={(v) => updateAudioVolume(track.id, v)} />
          <button onClick={() => removeAudioTrack(track.id)} className="hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
        </div>
      </div>
    </div>
  );
};

const TextClip = ({ overlay, pxPerSec }) => {
  const { removeTextOverlay } = useVideoContext();
  const width = overlay.duration * pxPerSec;
  const left = overlay.startTime * pxPerSec;

  return (
    <div 
      className="absolute top-1 bottom-1 bg-amber-500/80 rounded-md border border-amber-600 overflow-hidden shadow-sm group"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-2 py-1 text-[10px] text-white font-medium flex justify-between items-center h-full">
        <span className="truncate">"{overlay.text}"</span>
        <div className="hidden group-hover:flex items-center gap-1 bg-black/50 p-1 rounded">
          <button onClick={() => removeTextOverlay(overlay.id)} className="hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { clips, audioTracks, textOverlays, totalDuration, playheadPosition, updatePlayheadPosition, zoom, setZoom } = useVideoContext();
  const containerRef = useRef(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);

  // Default timeline display length. At least 60 seconds or total duration + 30s.
  const displayDuration = Math.max(60, totalDuration + 30);
  const pxPerSec = 20 * zoom; 

  const handleTimelineClick = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    
    // Calculate time based on click position
    const time = Math.max(0, Math.min(totalDuration, x / pxPerSec));
    updatePlayheadPosition(time);
  };

  const handleMouseMove = (e) => {
    if (isDraggingPlayhead) {
      handleTimelineClick(e);
    }
  };

  const handleMouseUp = () => setIsDraggingPlayhead(false);

  useEffect(() => {
    if (isDraggingPlayhead) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPlayhead, totalDuration, zoom]);

  if (clips.length === 0) return null;

  const playheadLeft = playheadPosition * pxPerSec;

  return (
    <div className="w-full bg-card border border-border p-4 rounded-xl shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm">Timeline Editor</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Zoom:</span>
          <input 
            type="range" min="0.5" max="3" step="0.1" 
            value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-24 h-1 bg-secondary rounded-lg appearance-none cursor-pointer" 
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden border border-border rounded-lg bg-secondary/10"
        style={{ height: '240px' }}
      >
        <div className="relative min-w-full" style={{ width: `${displayDuration * pxPerSec}px`, height: '100%' }}>
          
          {/* Time Ruler */}
          <div 
            className="h-8 border-b border-border/50 sticky top-0 bg-background/90 z-20 cursor-pointer"
            onMouseDown={(e) => { setIsDraggingPlayhead(true); handleTimelineClick(e); }}
          >
            {Array.from({ length: Math.ceil(displayDuration / 10) }).map((_, i) => (
              <div key={i} className="absolute text-[10px] text-muted-foreground border-l border-border/50 pl-1" style={{ left: `${i * 10 * pxPerSec}px`, top: 0, height: '100%' }}>
                {formatDuration(i * 10)}
              </div>
            ))}
          </div>

          {/* Tracks Container */}
          <div className="absolute top-8 bottom-0 left-0 right-0 py-2 flex flex-col gap-2">
            
            {/* Video Track */}
            <div className="relative h-14 bg-black/5 rounded-md border border-border/50 flex-shrink-0">
              <div className="absolute left-2 top-0 bottom-0 flex items-center text-[10px] font-bold text-muted-foreground uppercase opacity-50 z-0">Video Track</div>
              {clips.map(clip => <TimelineClip key={clip.id} clip={clip} pxPerSec={pxPerSec} />)}
            </div>

            {/* Audio Track */}
            <div className="relative h-14 bg-black/5 rounded-md border border-border/50 flex-shrink-0">
              <div className="absolute left-2 top-0 bottom-0 flex items-center text-[10px] font-bold text-muted-foreground uppercase opacity-50 z-0">Audio Track</div>
              {audioTracks.map(track => <AudioClip key={track.id} track={track} pxPerSec={pxPerSec} />)}
            </div>

            {/* Text Track */}
            <div className="relative h-10 bg-black/5 rounded-md border border-border/50 flex-shrink-0">
              <div className="absolute left-2 top-0 bottom-0 flex items-center text-[10px] font-bold text-muted-foreground uppercase opacity-50 z-0">Text Overlay</div>
              {textOverlays.map(overlay => <TextClip key={overlay.id} overlay={overlay} pxPerSec={pxPerSec} />)}
            </div>

          </div>

          {/* Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none"
            style={{ left: `${playheadLeft}px` }}
          >
            <div className="absolute -top-0 -left-1.5 w-3 h-3 bg-red-500 rounded-sm shadow-sm flex items-center justify-center pointer-events-auto cursor-ew-resize">
              <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="mt-2 text-center text-sm font-medium text-foreground flex justify-between">
        <span className="text-muted-foreground">Length: {formatDuration(totalDuration)}</span>
        <span>Current: <span className="font-mono text-primary">{formatDuration(playheadPosition)}</span></span>
      </div>
    </div>
  );
};

export default Timeline;
