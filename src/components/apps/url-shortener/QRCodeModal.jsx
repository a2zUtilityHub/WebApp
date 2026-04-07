import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2, Expand } from 'lucide-react';
import QRCode from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QRCodeModal = ({ isOpen, onClose, url }) => {
  const { toast } = useToast();
  const qrRef = useRef(null);
  const [size, setSize] = useState("256");

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast({ title: 'QR Code Downloaded!' });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Link Copied!' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared URL',
          url: url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for Your Link</DialogTitle>
          <DialogDescription>
            Scan this QR code to visit the link, or download it for marketing materials.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          
          <div className="flex justify-between w-full items-center mb-2 px-2">
             <span className="text-sm text-muted-foreground font-medium">Preview</span>
             <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">Small (128x128)</SelectItem>
                  <SelectItem value="256">Medium (256x256)</SelectItem>
                  <SelectItem value="512">Large (512x512)</SelectItem>
                  <SelectItem value="1024">HD (1024x1024)</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <div 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center relative group"
            ref={qrRef}
          >
            <QRCode 
              value={url || 'https://example.com'} 
              size={parseInt(size)}
              level="H"
              includeMargin={true}
              renderAs="canvas"
              className="max-w-[200px] max-h-[200px] sm:max-w-[250px] sm:max-h-[250px] object-contain"
            />
          </div>
          
          <div className="w-full bg-gray-50 rounded-lg p-3 text-center border overflow-hidden">
             <p className="text-sm font-mono truncate text-gray-700">{url}</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full justify-center">
            <Button variant="outline" onClick={handleCopyLink} className="flex-1 min-w-[100px]">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
            <Button onClick={handleDownload} className="flex-1 min-w-[100px] bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;