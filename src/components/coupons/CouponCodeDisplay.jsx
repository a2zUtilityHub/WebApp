import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Copy, CheckCircle, Eye, EyeOff, Calendar, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { trackEvent } from '@/lib/analytics';

const CouponCodeDisplay = ({ coupon }) => {
  const { toast } = useToast();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleReveal = async () => {
    setIsRevealed(true);

    let copySuccess = false;
    
    // Auto-copy functionality
    if (coupon.code) {
      try {
        await navigator.clipboard.writeText(coupon.code);
        copySuccess = true;
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("Failed to auto-copy code to clipboard:", error);
      }
    }

    // Open merchant link
    if (coupon.deal_link) {
      window.open(coupon.deal_link, '_blank', 'noopener,noreferrer');
    }

    // Toast feedback and tracking
    if (copySuccess) {
      toast({
        title: "Code Revealed & Copied!",
        description: "Code copied! Use Ctrl+V to paste on merchant site",
      });
      trackEvent('coupon_code_copied', { couponId: coupon.id, code: coupon.code });
    } else {
      toast({
        title: "Code Revealed!",
        description: "Code revealed! Copy it manually or use the Copy button",
      });
    }

    // Increment click count
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ click_count: (coupon.click_count || 0) + 1 })
        .eq('id', coupon.id);

      if (error) {
        console.error("Failed to update click count:", error);
      }
    } catch (err) {
      console.error("Error updating click count:", err);
    }
  };

  const handleCopy = async () => {
    if (!coupon.code) return;
    
    try {
      await navigator.clipboard.writeText(coupon.code);
      setIsCopied(true);
      toast({
        title: "Code Copied!",
        description: `${coupon.code} has been copied to clipboard`,
      });
      trackEvent('coupon_code_copied', { couponId: coupon.id, code: coupon.code });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Manual copy failed:", error);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const maskedCode = coupon.code ? '*'.repeat(Math.max(coupon.code.length - 4, 0)) + coupon.code.slice(-4) : 'NO CODE';

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
        <CardHeader className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="flex justify-between items-start gap-2">
            {coupon.merchant?.logo_url && (
              <img 
                src={coupon.merchant.logo_url} 
                alt={coupon.merchant.name} 
                className="h-12 w-auto object-contain" 
              />
            )}
            {coupon.is_verified && (
              <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-grow">
          <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2">{coupon.title}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-primary" />
            <p className="text-2xl font-extrabold text-primary">{coupon.discount_value}</p>
          </div>

          {coupon.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{coupon.description}</p>
          )}

          <div className="bg-muted/50 border-2 border-dashed rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Coupon Code</span>
              {!isRevealed && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReveal}
                  className="h-6 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" /> Show
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <code className="text-lg font-mono font-bold tracking-wider">
                {isRevealed ? coupon.code : maskedCode}
              </code>
              {isRevealed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6"
                >
                  {isCopied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {coupon.expires_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Expires {formatDistanceToNow(new Date(coupon.expires_at), { addSuffix: true })}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 flex-col items-stretch space-y-2 mt-auto">
          {!isRevealed ? (
            <Button 
              onClick={handleReveal} 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg font-bold shadow-lg"
            >
              <EyeOff className="mr-2 h-5 w-5" /> Show Code
            </Button>
          ) : (
            <Button 
              onClick={handleCopy} 
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-lg font-bold shadow-lg"
            >
              {isCopied ? (
                <><CheckCircle className="mr-2 h-5 w-5" /> Copied!</>
              ) : (
                <><Copy className="mr-2 h-5 w-5" /> Copy Code</>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CouponCodeDisplay;