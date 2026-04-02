import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, Image as ImageIcon, Code, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QRExportBar = ({ onGenerate, qrValue, hasLogo }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const getSvgXml = () => {
    const svg = document.querySelector('#qr-code-preview svg');
    if (!svg) return null;
    let svgData = new XMLSerializer().serializeToString(svg);
    
    const logoImg = document.querySelector('#qr-code-logo-img');
    if (logoImg && logoImg.src && logoImg.src !== window.location.href) {
        try {
            const size = svg.width.baseVal.value;
            // Parse inline styles for size, position, opacity
            const widthMatch = logoImg.style.width.match(/([\d.]+)px/);
            const logoWidth = widthMatch ? parseFloat(widthMatch[1]) : size * 0.25;
            const logoHeight = logoWidth; // Assuming square
            const opacity = parseFloat(logoImg.style.opacity) || 1;
            
            let logoX = (size - logoWidth) / 2;
            let logoY = (size - logoHeight) / 2;

            // Handle custom positioning
            if (logoImg.style.top && logoImg.style.top !== '50%') {
                logoY = parseFloat(logoImg.style.top);
            } else if (logoImg.style.bottom) {
                logoY = size - logoHeight - parseFloat(logoImg.style.bottom);
            }

            if (logoImg.style.left && logoImg.style.left !== '50%') {
                logoX = parseFloat(logoImg.style.left);
            } else if (logoImg.style.right) {
                logoX = size - logoWidth - parseFloat(logoImg.style.right);
            }

            const isCircle = logoImg.classList.contains('rounded-full');
            
            const clipPathId = 'qr-logo-clip-' + Date.now();
            let clipPath = '';
            if (isCircle) {
                clipPath = `<clipPath id="${clipPathId}"><circle cx="${logoX + logoWidth/2}" cy="${logoY + logoHeight/2}" r="${logoWidth/2}" /></clipPath>`;
            }
            
            const imageElement = `<image href="${logoImg.src}" x="${logoX}" y="${logoY}" height="${logoHeight}" width="${logoWidth}" opacity="${opacity}" ${isCircle ? `clip-path="url(#${clipPathId})"` : ''} />`;
            
            svgData = svgData.replace('</svg>', `${clipPath}${imageElement}</svg>`);
        } catch(e) {
            console.error("Error embedding logo into SVG", e);
        }
    }

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  const download = (dataUrl, format) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qrcode_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    const success = await onGenerate();
    if (!success) {
      toast({ title: "Content Required", description: "Please enter some data to generate a QR code.", variant: "destructive"});
      setIsExporting(false);
      return;
    }

    toast({ title: "Exporting...", description: `Preparing your ${format.toUpperCase()} file.`});

    setTimeout(() => {
      try {
        const svgDataUrl = getSvgXml();
        if (!svgDataUrl) {
          toast({ title: 'Error exporting QR code', description: 'Could not find the QR code element.', variant: 'destructive' });
          setIsExporting(false);
          return;
        }
        
        if (format === 'svg') {
          download(svgDataUrl, 'svg');
          setIsExporting(false);
          return;
        }
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = svgDataUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const previewDiv = document.querySelector('#qr-code-preview svg');
          if (!previewDiv) {
             setIsExporting(false);
             return;
          }

          const size = previewDiv.width.baseVal.value;
          
          // Export at 4x resolution for better quality
          const scale = 4;
          canvas.width = size * scale;
          canvas.height = size * scale;
          const ctx = canvas.getContext("2d");
          ctx.scale(scale, scale);
          
          // Background fill to prevent transparency issues in JPEG
          if (format === 'jpeg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, size, size);
          }
          
          ctx.drawImage(img, 0, 0);

          const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 1.0);
          download(dataUrl, format);
          setIsExporting(false);
        };
        img.onerror = () => {
            toast({ title: 'Export Error', description: 'Could not generate image. Try exporting as SVG instead.', variant: 'destructive' });
            setIsExporting(false);
        }
      } catch (err) {
        toast({ title: 'Export Failed', description: err.message, variant: 'destructive' });
        setIsExporting(false);
      }
    }, 150);
  };

  const handleCopyLink = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
      toast({ title: 'Link Copied!', description: 'The content of the QR code has been copied to your clipboard.' });
    } else {
       toast({ title: 'Nothing to copy', description: 'Please enter some data first.', variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      <Button 
        onClick={() => handleExport('png')} 
        className="w-full h-12 text-sm font-semibold"
        disabled={isExporting}
      >
        <ImageIcon className="mr-2 h-4 w-4" /> Download PNG
      </Button>
      {hasLogo && (
        <Button 
          onClick={() => handleExport('jpeg')} 
          variant="secondary" 
          className="w-full h-12 text-sm font-semibold border-2"
          disabled={isExporting}
        >
          <ImageIcon className="mr-2 h-4 w-4" /> Download JPG
        </Button>
      )}
      <Button 
        onClick={() => handleExport('svg')} 
        variant={hasLogo ? "outline" : "secondary"} 
        className={`w-full h-12 text-sm font-semibold ${hasLogo ? '' : 'border-2'}`}
        disabled={isExporting}
      >
        <Code className="mr-2 h-4 w-4" /> Download SVG
      </Button>
      <Button 
        variant="outline" 
        onClick={handleCopyLink} 
        className={`w-full h-12 text-sm font-semibold ${hasLogo ? '' : 'sm:col-span-2'}`}
      >
        <LinkIcon className="mr-2 h-4 w-4" /> Copy Content Link
      </Button>
    </div>
  );
};

export default QRExportBar;