import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Share2, CheckCircle, Copy, ArrowRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CouponDetailModal from './CouponDetailModal';
import { motion } from 'framer-motion';

const CouponCard = ({ coupon }) => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (coupon.expires_at) {
      const updateTimer = () => {
        const distance = formatDistanceToNow(new Date(coupon.expires_at), { addSuffix: true });
        setTimeLeft(distance);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 60000); // update every minute
      return () => clearInterval(interval);
    }
  }, [coupon.expires_at]);

  const handleAction = async (e) => {
    e.stopPropagation();
    if (coupon.type === 'coupon') {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: "Code Copied!", description: coupon.code });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      window.open(coupon.deal_link, '_blank');
    }
    // This is a 'fire and forget' call, no need to await
    supabase.rpc('increment_coupon_click', { coupon_id: coupon.id });
  };
  
  const handleSocialShare = (e) => {
    e.stopPropagation();
    toast({ title: "🚧 Feature Not Implemented", description: "Social sharing coming soon!" });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col overflow-hidden h-full cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
        >
          <CardHeader className="p-4">
            <div className="flex justify-between items-start gap-2">
              <img-replace src={coupon.merchant?.logo_url} alt={coupon.merchant?.name} className="h-10 w-auto object-contain" />
              {coupon.is_verified && (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <p className="font-bold text-lg leading-tight mb-2 h-12 line-clamp-2">{coupon.title}</p>
            <p className="text-2xl font-extrabold text-primary mb-2">{coupon.discount_value}</p>
            {coupon.expires_at && <p className="text-xs text-destructive">Expires {timeLeft}</p>}
          </CardContent>
          <CardFooter className="p-4 flex-col items-stretch space-y-2 mt-auto">
            <Button onClick={handleAction} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base font-bold">
              {coupon.type === 'coupon' ? (isCopied ? (<><CheckCircle className="mr-2 h-5 w-5"/> Copied!</>) : (<><Copy className="mr-2 h-5 w-5"/> Copy Code</>)) : (<><ArrowRight className="mr-2 h-5 w-5"/> Get Deal</>)}
            </Button>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex-1 justify-start p-1 h-auto" onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}>
                <Eye className="h-4 w-4 mr-1"/> View Details
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 justify-end p-1 h-auto" onClick={handleSocialShare}>
                <Share2 className="h-4 w-4 mr-1"/> Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      {isModalOpen && <CouponDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coupon={coupon} />}
    </>
  );
};

export default CouponCard;