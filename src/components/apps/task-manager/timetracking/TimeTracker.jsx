
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square, Pause } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

export const TimeTracker = () => {
  const { toast } = useToast();
  const { pushEvent } = useGoogleTagManager();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    pushEvent('time_tracking_started');
    toast({ title: "Timer Started", description: "Time tracking has begun." });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    pushEvent('time_tracking_paused', { is_paused: !isPaused });
  };

  const handleStop = () => {
    setIsActive(false);
    pushEvent('time_tracking_stopped', { tracked_seconds: time });
    setTime(0);
    toast({ title: "Timer Stopped", description: "Time entry has been logged." });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Clock className="w-8 h-8 text-teal-600" />
          Time Tracking
        </h1>
        <p className="text-muted-foreground mt-2">Log hours, track billable time, and compare estimates against actuals.</p>
      </div>

      <Card className="mb-8 border-teal-500/30 shadow-md">
        <CardHeader className="text-center pb-2">
          <CardTitle>Active Timer</CardTitle>
          <CardDescription>Select a task to begin tracking</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <div className="text-6xl md:text-8xl font-mono font-bold tracking-tighter text-teal-600 mb-8 tabular-nums">
            {formatTime(time)}
          </div>
          <div className="flex gap-4">
            {!isActive ? (
              <Button size="lg" className="w-32 bg-teal-600 hover:bg-teal-700" onClick={handleStart}>
                <Play className="w-5 h-5 mr-2" /> Start
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" className="w-32" onClick={handlePause}>
                  {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />} 
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button size="lg" variant="destructive" className="w-32" onClick={handleStop}>
                  <Square className="w-5 h-5 mr-2 fill-current" /> Stop
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Button variant="outline" onClick={() => {
          pushEvent('manual_time_entry_clicked');
          toast({title: "🚧 Manual Entry", description: "Manual time entry log will appear here."});
        }}>
          Log Time Manually
        </Button>
      </div>
    </div>
  );
};
