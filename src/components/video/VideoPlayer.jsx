import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useVideoContext } from '@/contexts/VideoContext';
import { formatDuration } from '@/lib/VideoMetadataExtractor';

const VideoPlayer = () => {
  const { 
    clips, 
    textOverlays, 
    aiFeatures,
    playheadPosition, 
    updatePlayheadPosition,
    totalDuration
  } = useVideoContext();
  
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const playInterval = useRef(null);

  const activeClip = clips.find(c => playheadPosition >= c.startTime && playheadPosition <= c.endTime) || clips[0];
  const activeClipUrl = activeClip ? URL.createObjectURL(activeClip.file) : null;

  useEffect(() => {
    if (videoRef.current && !isPlaying && activeClip) {
      const localTime = playheadPosition - activeClip.startTime;
      if (Math.abs(videoRef.current.currentTime - localTime) > 0.5) {
        videoRef.current.currentTime = localTime;
      }
    }
  }, [playheadPosition, activeClip, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(playInterval.current);
      if (videoRef.current) videoRef.current.pause();
    } else {
      if (videoRef.current) videoRef.current.play();
      playInterval.current = setInterval(() => {
        updatePlayheadPosition(prev => {
          if (prev >= totalDuration) {
            clearInterval(playInterval.current);
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement.requestFullscreen();
      }
    }
  };

  if (clips.length === 0) {
    return (
      <div className="w-full aspect-video bg-black/5 rounded-xl border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Upload a video to start editing</p>
      </div>
    );
  }

  const activeTexts = textOverlays.filter(t => playheadPosition >= t.startTime && playheadPosition <= (t.startTime + t.duration));
  
  // AI Subtitles rendering
  const activeSubtitle = aiFeatures.subtitles.enabled 
    ? aiFeatures.subtitles.data.find(s => playheadPosition >= s.startTime && playheadPosition <= s.endTime)
    : null;

  // CSS Filters for Color Correction
  let filterString = '';
  if (aiFeatures.colorCorrection.enabled) {
    const { brightness, contrast, saturation } = aiFeatures.colorCorrection;
    // Map -100...100 to CSS filter valid ranges
    const b = 1 + (brightness / 100);
    const c = 1 + (contrast / 100);
    const s = 1 + (saturation / 100);
    filterString = `brightness(${b}) contrast(${c}) saturate(${s})`;
  }

  // Object fit for Auto Crop
  const videoStyle = {
    filter: filterString || 'none',
    objectFit: aiFeatures.autoCrop.enabled ? 'cover' : 'contain',
    transform: aiFeatures.autoCrop.enabled ? 'scale(1.2)' : 'none' // Simulated simple crop zoom
  };

  return (
    <div className="group relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-border/50">
      {activeClipUrl && (
        <video
          ref={videoRef}
          src={activeClipUrl}
          className="w-full h-full transition-all duration-300"
          style={videoStyle}
          onClick={togglePlay}
          onEnded={() => {
            setIsPlaying(false);
            clearInterval(playInterval.current);
          }}
        />
      )}
      
      {/* Text Overlays Renderer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {activeTexts.map(txt => (
          <div
            key={txt.id}
            className="absolute drop-shadow-md whitespace-nowrap"
            style={{
              top: `${txt.y}%`,
              left: `${txt.x}%`,
              color: txt.color,
              fontSize: `${txt.size}px`,
              fontFamily: txt.font,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {txt.text}
          </div>
        ))}
      </div>

      {/* AI Subtitles Renderer */}
      {activeSubtitle && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="bg-black/60 text-white px-4 py-2 rounded text-lg font-medium tracking-wide border border-white/20 shadow-xl backdrop-blur-sm">
               {activeSubtitle.text}
            </div>
        </div>
      )}
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-primary transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button onClick={toggleMute} className="hover:text-primary transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <span className="text-xs font-medium tabular-nums font-mono">
              {formatDuration(playheadPosition)} / {formatDuration(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;