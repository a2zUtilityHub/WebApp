import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';

const VoiceoverRecorder = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);
  const { addAudioTrack, playheadPosition } = useVideoContext();
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setDuration(0);
      
      timerInterval.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
      
    } catch (err) {
      toast({ title: "Microphone Access Denied", description: "Please allow microphone permissions.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      clearInterval(timerInterval.current);
    }
  };

  const handleSave = () => {
    if (audioBlob) {
      const file = new File([audioBlob], `voiceover_${Date.now()}.webm`, { type: 'audio/webm' });
      addAudioTrack({
        file,
        duration: duration,
        startTime: playheadPosition,
        volume: 100,
        type: 'voiceover'
      });
      toast({ title: "Voiceover added", description: "Track added to timeline." });
      if (onComplete) onComplete();
    }
  };

  const handleDiscard = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Mic className="w-4 h-4 text-primary" /> Record Voiceover
      </h3>
      
      {!audioUrl ? (
        <div className="flex flex-col items-center py-4">
          <div className="text-2xl font-mono mb-4">{formatTime(duration)}</div>
          {isRecording ? (
            <Button variant="destructive" size="lg" className="rounded-full w-16 h-16" onClick={stopRecording}>
              <Square className="w-6 h-6 fill-current" />
            </Button>
          ) : (
            <Button variant="default" size="lg" className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600" onClick={startRecording}>
              <Mic className="w-6 h-6" />
            </Button>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            {isRecording ? "Recording... Click to stop" : "Click to start recording"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <audio src={audioUrl} controls className="w-full h-10" />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              <Trash2 className="w-4 h-4 mr-2" /> Discard
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" /> Add to Timeline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceoverRecorder;