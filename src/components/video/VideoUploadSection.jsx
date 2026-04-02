
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileVideo, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useVideoContext } from '@/contexts/VideoContext';
import { validateVideo } from '@/lib/videoValidation';
import { extractVideoMetadata, formatFileSize, formatDuration } from '@/lib/VideoMetadataExtractor';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const VideoUploadSection = () => {
  const { setUploadedVideo, videoMetadata } = useVideoContext();
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast({
        title: "Upload Failed",
        description: "Please upload a valid video file.",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    const validation = validateVideo(file);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      const metadata = await extractVideoMetadata(file);
      setUploadedVideo(file, metadata);
      toast({
        title: "Success",
        description: "Video loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read video file.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  }, [setUploadedVideo, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi']
    },
    maxFiles: 1,
    multiple: false
  });

  if (videoMetadata) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileVideo className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-foreground line-clamp-1">{videoMetadata.name}</h3>
            <p className="text-sm text-muted-foreground flex gap-3">
              <span>{formatFileSize(videoMetadata.size)}</span>
              <span>•</span>
              <span>{formatDuration(videoMetadata.duration)}</span>
              <span>•</span>
              <span>{videoMetadata.width}x{videoMetadata.height}</span>
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setUploadedVideo(null, null)}>
          Replace Video
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-secondary/10 text-secondary'}`}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            {isDragActive ? "Drop video here" : "Drag & drop your video here"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse from your computer
          </p>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground pt-4">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success"/> MP4, WebM, MOV</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success"/> Max 500MB</span>
        </div>
        
        {isExtracting && (
          <p className="text-sm text-primary animate-pulse mt-4">Processing video metadata...</p>
        )}
      </div>
    </div>
  );
};

export default VideoUploadSection;
