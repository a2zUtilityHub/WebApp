import React, { useEffect } from 'react';
import VideoUploadSection from './VideoUploadSection';
import VideoPlayer from './VideoPlayer';
import Timeline from './Timeline';
import EditingTools from './EditingTools';
import ExportPanel from './ExportPanel';
import { Film } from 'lucide-react';
import { useVideoContext } from '@/contexts/VideoContext';

const VideoEditor = () => {
  const context = useVideoContext();

  // Debugging verification
  useEffect(() => {
    console.log("[VideoEditor] Component Mounted Successfully.");
    return () => console.log("[VideoEditor] Component Unmounted.");
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Film className="w-8 h-8 text-primary" />
            Video Studio Pro
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-track timeline, advanced AI enhancements, text overlays, and more. All in your browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full">
        {/* Main Editor Area */}
        <div className="lg:col-span-8 space-y-6 w-full overflow-hidden">
          <VideoUploadSection />
          <VideoPlayer />
          <Timeline />
        </div>

        {/* Tools & Export Sidebar */}
        <div className="lg:col-span-4 space-y-6 w-full">
          <div className="sticky top-24">
             <EditingTools />
             <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;