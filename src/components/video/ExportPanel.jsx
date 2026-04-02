
import React, { useState } from 'react';
import { Download, Loader2, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';
import { exportComplexVideo } from '@/lib/ffmpegUtils';

const ExportPanel = () => {
  const { clips, audioTracks, textOverlays, aiFeatures, isProcessing, setProcessingState } = useVideoContext();
  const [filename, setFilename] = useState('masterpiece');
  const [format, setFormat] = useState('mp4');
  const [resolution, setResolution] = useState('720p');
  const { toast } = useToast();

  const handleExport = async () => {
    if (clips.length === 0) return;
    setProcessingState(true, 0);
    
    try {
      const blob = await exportComplexVideo({
        clips,
        audioTracks,
        textOverlays,
        aiFeatures,
        resolution,
        format,
        onProgress: (prog) => setProcessingState(true, prog)
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'video'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: "Your video has been exported with all effects applied.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "An error occurred during rendering. Ensure files are valid.",
        variant: "destructive"
      });
    } finally {
      setProcessingState(false, 0);
    }
  };

  if (clips.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Film className="w-5 h-5 text-primary" />
        Export Project
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">File Name</label>
          <input 
            type="text" 
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="w-full p-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="my_video"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Format</label>
            <select 
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="mp4">MP4 (H.264)</option>
              <option value="webm">WebM (VP9)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Resolution</label>
            <select 
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="720p">HD 720p</option>
              <option value="1080p">FHD 1080p</option>
            </select>
          </div>
        </div>

        <Button 
          className="w-full mt-4" 
          size="lg" 
          onClick={handleExport}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Rendering...</>
          ) : (
            <><Download className="w-5 h-5 mr-2" /> Export & Download</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;
