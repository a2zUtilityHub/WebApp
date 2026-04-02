import { useState, useCallback } from 'react';
import { couponsService } from '@/services/couponsService';
import { useToast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '@/utils/supabaseErrorHandler';

export const useCoupons = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCoupons = useCallback(async (filters) => {
    setLoading(true);
    try {
      return await retryWithBackoff(() => couponsService.getCoupons(filters), { context: 'fetchCoupons' });
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { data: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveCoupon = async (data, id) => {
    setLoading(true);
    try {
      await retryWithBackoff(async () => {
        if (id) await couponsService.updateCoupon(id, data);
        else await couponsService.createCoupon(data);
      });
      toast({ title: 'Success', description: `Coupon ${id ? 'updated' : 'created'} successfully` });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    try {
      await retryWithBackoff(() => couponsService.deleteCoupon(id));
      toast({ title: 'Success', description: 'Coupon deleted' });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchCoupons, saveCoupon, deleteCoupon, bulkAction: couponsService.bulkAction };
};