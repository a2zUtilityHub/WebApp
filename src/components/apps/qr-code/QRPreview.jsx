import React from 'react';
import QRCode from 'qrcode.react';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';

const QRPreview = ({ 
  value, 
  fgColor, 
  bgColor, 
  size, 
  logo, 
  logoShape, 
  level,
  logoSize = 25,
  logoOpacity = 100,
  logoPosition = 'center'
}) => {
  const debouncedValue = useDebounce(value, 300);

  const qrCodeProps = {
    value: debouncedValue || 'https://hostinger.com',
    size: size,
    fgColor: fgColor,
    bgColor: bgColor,
    level: level || 'H',
    renderAs: 'svg',
    includeMargin: true,
  };

  const getPositionStyles = () => {
    const actualSize = size * (logoSize / 100);
    const offset = 8; // Small padding from edges

    switch (logoPosition) {
      case 'top-left':
        return { top: `${offset}px`, left: `${offset}px` };
      case 'top-right':
        return { top: `${offset}px`, right: `${offset}px` };
      case 'bottom-left':
        return { bottom: `${offset}px`, left: `${offset}px` };
      case 'bottom-right':
        return { bottom: `${offset}px`, right: `${offset}px` };
      case 'center':
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-6 min-h-[350px]">
      <h2 className="text-xl font-semibold text-center">Live Preview</h2>
      <motion.div
        key={debouncedValue + fgColor + bgColor + size + logo + level + logoSize + logoOpacity + logoPosition}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        id="qr-code-preview"
        className="flex items-center justify-center bg-white shadow-sm border rounded-xl overflow-hidden relative"
        style={{
          background: bgColor,
          padding: '16px',
        }}
      >
        <QRCode {...qrCodeProps} />
        {logo && (
          <img
            id="qr-code-logo-img"
            src={logo}
            alt="QR Code Logo"
            crossOrigin="anonymous"
            className={`absolute object-cover border-4 bg-white ${logoShape === 'circle' ? 'rounded-full' : 'rounded-md'}`}
            style={{
              ...getPositionStyles(),
              width: `${size * (logoSize / 100)}px`,
              height: `${size * (logoSize / 100)}px`,
              borderColor: bgColor,
              opacity: logoOpacity / 100,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default QRPreview;