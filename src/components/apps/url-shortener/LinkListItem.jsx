import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, QrCode, Edit, Trash2, ExternalLink, Calendar, MousePointerClick, ShieldAlert, Clock } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import EditLinkModal from './EditLinkModal';
import { useToast } from '@/components/ui/use-toast';

const LinkListItem = ({ link, onUpdate, onDelete }) => {
  const { toast } = useToast();
  const [isQROpen, setIsQROpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getShortUrl = () => {
    return `${window.location.origin}/${link.custom_slug || link.short_code}`;
  };

  const shortUrl = getShortUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast({ title: 'Copied!', description: 'Link copied to clipboard.' });
  };

  const isExpired = link.expires_at && new Date(link.expires_at) < new Date();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow group relative overflow-hidden">
        {isExpired && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
            EXPIRED
          </div>
        )}
        <CardContent className={`p-5 ${isExpired ? 'opacity-70' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-primary hover:underline truncate">
                  {shortUrl}
                </a>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-gray-500 truncate max-w-full" title={link.original_url}>
                {link.original_url}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(link.created_at), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1 font-medium text-gray-700">
                  <MousePointerClick className="w-3.5 h-3.5" />
                  {link.visit_count || 0} clicks
                </div>
                {link.password && (
                  <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3 h-3" /> Protected
                  </div>
                )}
                {link.expires_at && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${isExpired ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                    <Clock className="w-3 h-3" /> 
                    {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(link.expires_at), { addSuffix: true })}`}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 md:flex-col lg:flex-row border-t md:border-t-0 pt-4 md:pt-0">
              <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 md:flex-none">
                <Copy className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Copy</span>
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsQROpen(true)} title="QR Code">
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)} title="Edit">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(link.id)} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <QRCodeModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} url={shortUrl} />
      <EditLinkModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} link={link} onUpdate={onUpdate} />
    </>
  );
};

export default LinkListItem;