
import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LinkPreviewCard = ({ url }) => {
  const previewData = useMemo(() => {
    if (!url) return null;
    
    try {
      // Basic formatting if missing protocol to parse URL
      const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      const parsedUrl = new URL(formattedUrl);
      
      const isHttps = parsedUrl.protocol === 'https:';
      const domain = parsedUrl.hostname;
      
      return {
        domain,
        isSecure: isHttps,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        fullUrl: parsedUrl.href,
        path: parsedUrl.pathname + parsedUrl.search
      };
    } catch (e) {
      return null;
    }
  }, [url]);

  if (!previewData) return null;

  return (
    <Card className="w-full bg-gray-50/80 border border-gray-100 shadow-sm overflow-hidden animate-scale-in">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
          {previewData.favicon ? (
            <img 
              src={previewData.favicon} 
              alt={`${previewData.domain} favicon`} 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <Globe className="w-6 h-6 text-gray-400 hidden" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 truncate">
              {previewData.domain}
            </span>
            {previewData.isSecure ? (
              <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-success/10 text-success whitespace-nowrap">
                <ShieldCheck className="w-3 h-3 mr-1" /> Secure
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-warning/20 text-warning-foreground whitespace-nowrap">
                <ShieldAlert className="w-3 h-3 mr-1" /> Not Secure
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate" title={previewData.fullUrl}>
            {previewData.path !== '/' ? previewData.path : previewData.fullUrl}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkPreviewCard;
