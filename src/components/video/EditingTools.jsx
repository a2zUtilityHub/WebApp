import React, { useState } from 'react';
import { Scissors, Mic, Type, Music, Undo2, Redo2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoContext } from '@/contexts/VideoContext';
import AudioTrack from './AudioTrack';
import TextEditor from './TextEditor';
import VoiceoverRecorder from './VoiceoverRecorder';
import AIFeaturesPanel from './AIFeaturesPanel';

const EditingTools = () => {
  const { clips, undo, redo, history } = useVideoContext();
  const [activeTool, setActiveTool] = useState(null);

  if (clips.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Creative Tools</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={undo} disabled={history.past.length === 0} title="Undo">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={history.future.length === 0} title="Redo">
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        <Button 
          variant={activeTool === 'music' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setActiveTool(activeTool === 'music' ? null : 'music')}
        >
          <Music className="w-4 h-4 mr-2" /> Add Music
        </Button>
        <Button 
          variant={activeTool === 'voiceover' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setActiveTool(activeTool === 'voiceover' ? null : 'voiceover')}
        >
          <Mic className="w-4 h-4 mr-2" /> Voiceover
        </Button>
        <Button 
          variant={activeTool === 'text' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
        >
          <Type className="w-4 h-4 mr-2" /> Add Text
        </Button>
        <Button 
          variant={activeTool === 'ai' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setActiveTool(activeTool === 'ai' ? null : 'ai')}
          className="text-primary border-primary/50 hover:bg-primary/10"
        >
          <Sparkles className="w-4 h-4 mr-2" /> AI Tools
        </Button>
      </div>

      <div className="relative min-h-[100px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {!activeTool && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Select a tool above to enhance your video.
          </p>
        )}
        {activeTool === 'music' && <AudioTrack onComplete={() => setActiveTool(null)} />}
        {activeTool === 'voiceover' && <VoiceoverRecorder onComplete={() => setActiveTool(null)} />}
        {activeTool === 'text' && <TextEditor onComplete={() => setActiveTool(null)} />}
        {activeTool === 'ai' && <AIFeaturesPanel />}
      </div>
    </div>
  );
};

export default EditingTools;