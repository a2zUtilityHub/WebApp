import React from 'react';
import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DevelopmentBadge = ({ status }) => {
  if (status !== 'Development') return null;

  return (
    <Badge className="absolute top-3 right-3 bg-amber-400 text-amber-950 hover:bg-amber-500 border-none font-bold shadow-md flex items-center gap-1.5 z-10 px-2.5 py-0.5 uppercase tracking-wide text-[10px]">
      <Construction className="h-3.5 w-3.5" />
      In Development
    </Badge>
  );
};

export default DevelopmentBadge;