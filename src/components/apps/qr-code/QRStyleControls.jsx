import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, Circle, Droplet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QRStyleControls = ({ fgColor, setFgColor, bgColor, setBgColor, size, setSize, qrStyle, setQrStyle, level, setLevel }) => {
  const { toast } = useToast();

  const handleStyleChange = (style) => {
    setQrStyle(style);
    if (style !== 'square') {
      toast({
        title: "🚧 Feature Coming Soon!",
        description: "Advanced QR styles will be available in a future update.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fg-color">QR Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="fg-color"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="p-1 h-10 w-16 cursor-pointer"
            />
            <Input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="font-mono text-sm uppercase"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bg-color">Background Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="bg-color"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="p-1 h-10 w-16 cursor-pointer"
            />
            <Input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="font-mono text-sm uppercase"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="size">Size ({size}px)</Label>
        <Slider
          id="size"
          min={50}
          max={500}
          step={10}
          value={[size]}
          onValueChange={(val) => setSize(val[0])}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Error Correction Level</Label>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger id="level">
            <SelectValue placeholder="Select error correction level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Low (7%) - Best for simple URLs</SelectItem>
            <SelectItem value="M">Medium (15%) - Standard</SelectItem>
            <SelectItem value="Q">Quartile (25%) - Good for logos</SelectItem>
            <SelectItem value="H">High (30%) - Best for large logos</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">Higher levels make the QR code denser but more resilient to damage or logo overlap.</p>
      </div>

      <div className="space-y-2 hidden">
        <Label>Style</Label>
        <Tabs value={qrStyle} onValueChange={handleStyleChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="square"><Square className="h-4 w-4 mr-2" />Square</TabsTrigger>
            <TabsTrigger value="dots"><Circle className="h-4 w-4 mr-2" />Dots</TabsTrigger>
            <TabsTrigger value="rounded"><Droplet className="h-4 w-4 mr-2" />Rounded</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default QRStyleControls;