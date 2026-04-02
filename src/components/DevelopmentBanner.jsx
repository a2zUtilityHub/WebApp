import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const DevelopmentBanner = () => {
  return (
    <div className="sticky top-0 z-[100] w-full bg-teal-600 text-white py-3 px-4 lg:px-8 shadow-md flex items-center justify-between flex-wrap md:flex-nowrap gap-3 transition-all">
      <div className="flex-1 min-w-0 flex justify-center md:justify-start">
        <p className="text-sm md:text-base font-medium md:whitespace-nowrap md:truncate text-center md:text-left leading-snug">
          This website is under development. Please help us complete it quickly as we are targeting more than 200 useful apps. Many thanks!
        </p>
      </div>
      <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
        <Button asChild variant="outline" size="sm" className="bg-transparent text-white border-white/50 hover:bg-white/20 hover:text-white transition-colors h-9 whitespace-nowrap">
          <Link to="/donate">
            <Heart className="h-4 w-4 mr-1.5 fill-current" /> Donate
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DevelopmentBanner;