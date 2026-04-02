import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

const LogoCustomizationPanel = ({ 
  logoSize, 
  setLogoSize, 
  logoOpacity, 
  setLogoOpacity,
  logoPosition,
  setLogoPosition,
  onClear 
}) => {
  return (
    <div className="space-y-6 pt-4 border-t mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Logo Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-red-500 h-8 px-2">
          <Trash2 className="h-4 w-4 mr-1" /> Remove Logo
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label htmlFor="logo-size" className="text-sm">Logo Size ({logoSize}%)</Label>
        </div>
        <Slider
          id="logo-size"
          min={10}
          max={40}
          step={1}
          value={[logoSize]}
          onValueChange={(val) => setLogoSize(val[0])}
          className="py-2"
        />
        <p className="text-xs text-muted-foreground">Keep under 30% to maintain scanability.</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label htmlFor="logo-opacity" className="text-sm">Logo Opacity ({logoOpacity}%)</Label>
        </div>
        <Slider
          id="logo-opacity"
          min={10}
          max={100}
          step={5}
          value={[logoOpacity]}
          onValueChange={(val) => setLogoOpacity(val[0])}
          className="py-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo-position">Logo Position</Label>
        <Select value={logoPosition} onValueChange={setLogoPosition}>
          <SelectTrigger id="logo-position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="top-left">Top Left</SelectItem>
            <SelectItem value="top-right">Top Right</SelectItem>
            <SelectItem value="bottom-left">Bottom Left</SelectItem>
            <SelectItem value="bottom-right">Bottom Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LogoCustomizationPanel;