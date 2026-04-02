import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, ArrowRight, Calendar, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const CouponDetailModal = ({ isOpen, onClose, coupon }) => {
  const { toast } = useToast();
  
  if (!coupon) return null;

  const handleAction = async () => {
    if (coupon.type === 'coupon') {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: "Code Copied!", description: coupon.code });
    } else {
      window.open(coupon.deal_link, '_blank');
    }
    await supabase.rpc('increment_coupon_click', { coupon_id: coupon.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <img-replace src={coupon.merchant.logo_url} alt={coupon.merchant.name} className="h-12 w-auto object-contain" />
            <div>
                <DialogTitle className="text-2xl">{coupon.title}</DialogTitle>
                <DialogDescription>{coupon.merchant.name}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
            <p className="text-4xl font-extrabold text-primary text-center my-4">{coupon.discount_value}</p>

            {coupon.long_description && (
                <p className="text-muted-foreground">{coupon.long_description}</p>
            )}

            {coupon.terms_and_conditions && (
                <div>
                    <h4 className="font-semibold flex items-center mb-2"><Info className="h-4 w-4 mr-2"/>Terms & Conditions</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{coupon.terms_and_conditions}</p>
                </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                    {coupon.expires_at ? `Expires on ${format(new Date(coupon.expires_at), 'MMMM d, yyyy')}` : 'No expiration date'}
                </span>
            </div>

            {coupon.is_verified && (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600 hover:bg-green-700 w-fit">
                    <CheckCircle className="h-3 w-3" /> Verified
                </Badge>
            )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleAction}>
            {coupon.type === 'coupon' ? (
                <><Copy className="mr-2 h-4 w-4" /> Copy Code</>
            ) : (
                <><ArrowRight className="mr-2 h-4 w-4" /> Go to Deal</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDetailModal;