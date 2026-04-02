import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Download, Upload, Settings } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/ui/use-toast';
import bwipjs from 'bwip-js';

const barcodeFormats = [
  { value: 'qrcode', label: 'QR Code' },
  { value: 'code128', label: 'Code 128' },
  { value: 'code39', label: 'Code 39' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'ean8', label: 'EAN-8' },
  { value: 'upca', label: 'UPC-A' },
  { value: 'upce', label: 'UPC-E' },
  { value: 'isbn', label: 'ISBN' },
  { value: 'datamatrix', label: 'DataMatrix' },
  { value: 'gs1-128', label: 'GS1-128' },
];

const BarcodeGenerator = () => {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('code128');
  const [options, setOptions] = useState({
    width: 2,
    height: 100,
    margin: 10,
    showText: true,
    errorCorrection: 'L',
  });
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const debouncedText = useDebounce(text, 300);
  const debouncedOptions = useDebounce(options, 300);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const bwipOptions = {
        bcid: format,
        text: debouncedText || 'placeholder',
        scale: debouncedOptions.width,
        height: debouncedOptions.height / 10,
        includetext: debouncedOptions.showText,
        textxalign: 'center',
        guardwhitespace: true,
        ...(format === 'qrcode' && { eclevel: debouncedOptions.errorCorrection }),
      };

      bwipjs.toCanvas(canvasRef.current, bwipOptions, (err) => {
        if(err) {
          setError(err.message || 'Invalid input for selected barcode type.');
        } else {
          setError('');
        }
      });
    } catch (e) {
      setError(e.message || 'Invalid input for selected barcode type.');
    }
  }, [debouncedText, format, debouncedOptions]);

  const handleDownload = (fileType) => {
    const canvas = canvasRef.current;
    if (!canvas || error) {
      toast({ title: "Cannot Download", description: "Please fix the errors before downloading.", variant: "destructive" });
      return;
    }
    const url = canvas.toDataURL(`image/${fileType}`);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${text || 'barcode'}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = () => {
    toast({
      title: "🚧 Premium Feature Coming Soon!",
      description: "Bulk generation from CSV will be available in a future update.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5" />Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="barcode-text">Data</Label>
            <Input id="barcode-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter data for barcode" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="barcode-format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="barcode-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {barcodeFormats.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Width: {options.width}</Label>
            <Slider value={[options.width]} onValueChange={([val]) => setOptions(o => ({ ...o, width: val }))} min={1} max={5} step={0.5} />
          </div>
          <div className="space-y-2">
            <Label>Height: {options.height}</Label>
            <Slider value={[options.height]} onValueChange={([val]) => setOptions(o => ({ ...o, height: val }))} min={20} max={200} step={10} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-text">Show Label Text</Label>
            <Switch id="show-text" checked={options.showText} onCheckedChange={(checked) => setOptions(o => ({ ...o, showText: checked }))} />
          </div>
          {format === 'qrcode' && (
            <div className="space-y-2">
              <Label>Error Correction</Label>
              <Select value={options.errorCorrection} onValueChange={(val) => setOptions(o => ({ ...o, errorCorrection: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (L)</SelectItem>
                  <SelectItem value="M">Medium (M)</SelectItem>
                  <SelectItem value="Q">Quartile (Q)</SelectItem>
                  <SelectItem value="H">High (H)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] bg-muted/50 rounded-lg p-4">
            {error ? (
              <div className="text-center text-destructive">
                <p className="font-bold">Generation Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            )}
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={() => handleDownload('png')}><Download className="mr-2 h-4 w-4" />PNG</Button>
            <Button onClick={() => handleDownload('jpeg')}><Download className="mr-2 h-4 w-4" />JPG</Button>
            <Button onClick={handleBulkUpload} variant="outline">
              <Upload className="mr-2 h-4 w-4" />Bulk Generate (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarcodeGenerator;