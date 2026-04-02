import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Facebook, Link as LinkIcon, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ShareButtons = ({ url = window.location.href, title = document.title }) => {
    const { toast } = useToast();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Page URL copied to clipboard." });
    };

    return (
        <div className="flex gap-2 items-center">
            <span className="text-sm font-medium mr-2">Share:</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank')}>
                <Twitter className="h-4 w-4 text-blue-400" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}>
                <Linkedin className="h-4 w-4 text-blue-700" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}>
                <Facebook className="h-4 w-4 text-blue-600" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_blank')}>
                <Mail className="h-4 w-4 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={copyToClipboard}>
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default ShareButtons;