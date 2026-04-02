
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Mail, Link as LinkIcon, Check, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ShareButtons = ({ url, title = "Check out this link!" }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (err) {
        console.log('User cancelled native share or it failed', err);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      <Button 
        variant="outline" 
        size="icon" 
        className={`rounded-full transition-all duration-300 ${copied ? 'bg-success/10 text-success border-success/20' : ''}`}
        onClick={handleCopy}
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </Button>

      {navigator.share && (
        <Button variant="outline" size="icon" className="rounded-full" onClick={handleNativeShare} title="Share via device">
          <Share2 className="w-4 h-4" />
        </Button>
      )}

      <Button variant="outline" size="icon" className="rounded-full hover:text-[#1DA1F2] hover:border-[#1DA1F2]" asChild>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" title="Share on Twitter">
          <Twitter className="w-4 h-4" />
        </a>
      </Button>
      
      <Button variant="outline" size="icon" className="rounded-full hover:text-[#0A66C2] hover:border-[#0A66C2]" asChild>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
          <Linkedin className="w-4 h-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" className="rounded-full hover:text-[#1877F2] hover:border-[#1877F2]" asChild>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
          <Facebook className="w-4 h-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" className="rounded-full hover:text-[#25D366] hover:border-[#25D366]" asChild>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </a>
      </Button>

      <Button variant="outline" size="icon" className="rounded-full hover:text-gray-600" asChild>
        <a href={shareLinks.email} title="Share via Email">
          <Mail className="w-4 h-4" />
        </a>
      </Button>
    </div>
  );
};

export default ShareButtons;
