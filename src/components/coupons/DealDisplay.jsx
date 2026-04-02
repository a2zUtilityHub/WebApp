import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ExternalLink, CheckCircle, Calendar, Percent } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const DealDisplay = ({ coupon }) => {
  const { toast } = useToast();

  const handleGetDeal = async () => {
    if (!coupon.deal_link) {
      toast({
        title: "No deal link",
        description: "This deal doesn't have a valid link",
        variant: "destructive"
      });
      return;
    }

    // Track click
    try {
      await supabase.rpc('increment_coupon_click', { coupon_id: coupon.id });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    window.open(coupon.deal_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 border-2">
        <CardHeader className="p-0 relative">
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
            {coupon.image_url ? (
              <img 
                src={coupon.image_url} 
                alt={coupon.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Percent className="h-16 w-16 text-primary/40" />
              </div>
            )}
            {coupon.is_verified && (
              <Badge 
                variant="default" 
                className="absolute top-3 right-3 flex items-center gap-1 bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <CheckCircle className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
          {coupon.merchant?.logo_url && (
            <div className="absolute bottom-0 left-4 transform translate-y-1/2">
              <div className="bg-white rounded-lg shadow-lg p-2 border-2">
                <img 
                  src={coupon.merchant.logo_url} 
                  alt={coupon.merchant.name} 
                  className="h-10 w-auto object-contain" 
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 flex-grow pt-8">
          <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2">{coupon.title}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-lg shadow-md">
              <p className="text-2xl font-extrabold">{coupon.discount_value}</p>
            </div>
          </div>

          {coupon.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{coupon.description}</p>
          )}

          {coupon.expires_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Expires {formatDistanceToNow(new Date(coupon.expires_at), { addSuffix: true })}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 flex-col items-stretch mt-auto">
          <Button 
            onClick={handleGetDeal} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg font-bold shadow-lg"
          >
            <ExternalLink className="mr-2 h-5 w-5" /> Get This Deal
          </Button>
          {coupon.merchant?.name && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Available at {coupon.merchant.name}
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DealDisplay;