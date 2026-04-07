import React, { useState } from 'react';
import { Type, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useVideoContext } from '@/contexts/VideoContext';
import { useToast } from '@/components/ui/use-toast';

const TextEditor = ({ onComplete }) => {
  const { addTextOverlay, playheadPosition } = useVideoContext();
  const { toast } = useToast();
  
  const [text, setText] = useState('Your Text Here');
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(48);
  const [color, setColor] = useState('#ffffff');

  const handleAdd = () => {
    if (!text.trim()) return;
    addTextOverlay({
      text,
      font,
      size,
      color,
      x: 50,
      y: 50,
      startTime: playheadPosition,
      duration: 5,
    });
    toast({ title: "Text Added", description: "Overlay added at current playhead." });
    if (onComplete) onComplete();
  };

  return (
    <div className="p-4 bg-secondary/10 rounded-xl border border-border space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
        <Type className="w-4 h-4 text-primary" /> Add Text Overlay
      </h3>
      
      <div className="space-y-2">
        <Label>Text Content</Label>
        <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <select 
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={font} onChange={e => setFont(e.target.value)}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex gap-2">
            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-16" />
            <Input type="text" value={color} onChange={e => setColor(e.target.value)} className="h-10 flex-1 font-mono text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex justify-between">
          <span>Font Size</span>
          <span>{size}px</span>
        </Label>
        <Slider min={12} max={120} step={1} value={[size]} onValueChange={v => setSize(v[0])} />
      </div>

      <Button onClick={handleAdd} className="w-full mt-2">
        <Check className="w-4 h-4 mr-2" /> Apply Text
      </Button>
    </div>
  );
};

export default TextEditor;