import React, { useRef, useState, useEffect } from 'react';
import { useVideoContext } from '@/contexts/VideoContext';
import { formatDuration } from '@/lib/VideoMetadataExtractor';
import { Scissors, Trash2 } from 'lucide-react';
import VolumeControl from './VolumeControl';

// Sub-components to prevent Vite resolution errors from spreading files
const ClipHandle = ({ onDrag, isLeft }) => (
  <div 
    className={`absolute top-0 bottom-0 w-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm cursor-ew-resize z-10 transition-colors flex items-center justify-center ${isLeft ? 'left-0 rounded-l-lg' : 'right-0 rounded-r-lg'}`}
    onMouseDown={(e) => { e.stopPropagation(); onDrag(e); }}
  >
    <div className="w-1 h-4 bg-white/90 rounded-full shadow-sm"></div>
  </div>
);

const TimelineClip = ({ clip, pxPerSec }) => {
  const { removeClip, updateClip } = useVideoContext();
  const width = clip.duration * pxPerSec;
  const left = clip.startTime * pxPerSec;

  return (
    <div 
      className="absolute top-1 bottom-1 bg-gradient-to-b from-indigo-500/90 to-indigo-600/90 rounded-lg border border-indigo-400/50 shadow-inner group transition-all hover:brightness-110 overflow-hidden"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-3 py-1.5 text-[11px] text-white font-semibold flex justify-between items-center h-full relative z-0">
        <span className="truncate drop-shadow-md">{clip.file.name}</span>
        <div className="hidden group-hover:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-md shadow-lg">
          <button onClick={() => removeClip(clip.id)} className="hover:text-red-400 transition-colors p-0.5"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      </div>
      <ClipHandle isLeft={true} onDrag={() => {}} />
      <ClipHandle isLeft={false} onDrag={() => {}} />
    </div>
  );
};

const AudioClip = ({ track, pxPerSec }) => {
  const { removeAudioTrack, updateAudioVolume } = useVideoContext();
  const width = track.duration * pxPerSec;
  const left = track.startTime * pxPerSec;

  return (
    <div 
      className="absolute top-1 bottom-1 bg-gradient-to-b from-emerald-500/90 to-emerald-600/90 rounded-lg border border-emerald-400/50 shadow-inner group transition-all hover:brightness-110 overflow-hidden"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-3 py-1.5 text-[11px] text-white font-semibold flex justify-between items-center h-full relative z-0">
        <span className="truncate drop-shadow-md">{track.type === 'voiceover' ? 'Voiceover' : track.file.name}</span>
        <div className="hidden group-hover:flex items-center gap-2 bg-black/60 backdrop-blur-md p-1 rounded-md shadow-lg">
          <VolumeControl volume={track.volume} onChange={(v) => updateAudioVolume(track.id, v)} />
          <button onClick={() => removeAudioTrack(track.id)} className="hover:text-red-400 transition-colors p-0.5"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      </div>
      <ClipHandle isLeft={true} onDrag={() => {}} />
      <ClipHandle isLeft={false} onDrag={() => {}} />
    </div>
  );
};

const TextClip = ({ overlay, pxPerSec }) => {
  const { removeTextOverlay } = useVideoContext();
  const width = overlay.duration * pxPerSec;
  const left = overlay.startTime * pxPerSec;

  return (
    <div 
      className="absolute top-1 bottom-1 bg-gradient-to-b from-amber-500/90 to-amber-600/90 rounded-lg border border-amber-400/50 shadow-inner group transition-all hover:brightness-110 overflow-hidden"
      style={{ width: `${width}px`, left: `${left}px` }}
    >
      <div className="px-3 py-1.5 text-[11px] text-white font-semibold flex justify-between items-center h-full relative z-0">
        <span className="truncate drop-shadow-md">"{overlay.text}"</span>
        <div className="hidden group-hover:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-md shadow-lg">
          <button onClick={() => removeTextOverlay(overlay.id)} className="hover:text-red-400 transition-colors p-0.5"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      </div>
      <ClipHandle isLeft={true} onDrag={() => {}} />
      <ClipHandle isLeft={false} onDrag={() => {}} />
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
    <div className="w-full bg-background/80 backdrop-blur-2xl border border-border/50 p-5 md:p-6 rounded-[2rem] shadow-2xl mt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary/10 rounded-xl border border-primary/20"><Scissors className="w-5 h-5 text-primary" /></div>
           <h3 className="font-extrabold text-lg text-foreground tracking-tight">Timeline Editor</h3>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
          <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Zoom</span>
          <input 
            type="range" min="0.5" max="3" step="0.1" 
            value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-28 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
          />
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden border border-border/50 rounded-2xl bg-muted/10 shadow-inner custom-scrollbar"
        style={{ height: '280px' }}
      >
        <div className="relative min-w-full" style={{ width: `${displayDuration * pxPerSec}px`, height: '100%' }}>
          
          {/* Pro Time Ruler */}
          <div 
            className="h-9 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-md z-20 cursor-pointer flex items-end"
            onMouseDown={(e) => { setIsDraggingPlayhead(true); handleTimelineClick(e); }}
          >
            {Array.from({ length: Math.ceil(displayDuration / 10) }).map((_, i) => (
              <div key={i} className="absolute text-[10px] font-bold text-muted-foreground border-l-2 border-border pl-1 pb-1" style={{ left: `${i * 10 * pxPerSec}px`, top: 0, height: '100%' }}>
                {formatDuration(i * 10)}
              </div>
            ))}
          </div>

          {/* Tracks Container */}
          <div className="absolute top-9 bottom-0 left-0 right-0 py-3 px-1 flex flex-col gap-3">
            
            {/* Video Track */}
            <div className="relative h-16 bg-black/5 dark:bg-white/5 rounded-xl border border-border/50 flex-shrink-0 shadow-inner">
              <div className="absolute left-3 top-0 bottom-0 flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 z-0">Video Track</div>
              {clips.map(clip => <TimelineClip key={clip.id} clip={clip} pxPerSec={pxPerSec} />)}
            </div>

            {/* Audio Track */}
            <div className="relative h-14 bg-black/5 dark:bg-white/5 rounded-xl border border-border/50 flex-shrink-0 shadow-inner">
              <div className="absolute left-3 top-0 bottom-0 flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 z-0">Audio Track</div>
              {audioTracks.map(track => <AudioClip key={track.id} track={track} pxPerSec={pxPerSec} />)}
            </div>

            {/* Text Track */}
            <div className="relative h-12 bg-black/5 dark:bg-white/5 rounded-xl border border-border/50 flex-shrink-0 shadow-inner">
              <div className="absolute left-3 top-0 bottom-0 flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 z-0">Text Overlay</div>
              {textOverlays.map(overlay => <TextClip key={overlay.id} overlay={overlay} pxPerSec={pxPerSec} />)}
            </div>

          </div>

          {/* Pro Playhead */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]"
            style={{ left: `${playheadLeft}px` }}
          >
            <div className="absolute top-0 -left-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 pointer-events-auto cursor-ew-resize drop-shadow-md"></div>
          </div>

        </div>
      </div>
      
      <div className="mt-4 text-center text-[13px] font-bold flex justify-between bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
        <span className="text-muted-foreground uppercase tracking-wider">Total Length: <span className="text-foreground">{formatDuration(totalDuration)}</span></span>
        <span className="uppercase tracking-wider text-muted-foreground">Current: <span className="font-mono text-primary text-[14px] ml-1 bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shadow-sm">{formatDuration(playheadPosition)}</span></span>
      </div>
    </div>
  );
};

export default Timeline;