import { useState, useCallback } from 'react';
import { newsletterService } from '@/services/newsletterService';
import { useToast } from '@/components/ui/use-toast';

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSubscribers = useCallback(async (filters) => {
    setLoading(true);
    try {
      const result = await newsletterService.getSubscribers(filters);
      return result;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return { data: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const subscribe = async (email) => {
    setLoading(true);
    try {
      const result = await newsletterService.subscribeEmail(email);
      toast({ title: 'Success', description: result.message });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (email) => {
    setLoading(true);
    try {
      await newsletterService.unsubscribeEmail(email);
      toast({ title: 'Unsubscribed', description: 'You have been unsubscribed.' });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    setLoading(true);
    try {
      await newsletterService.deleteSubscriber(id);
      toast({ title: 'Deleted', description: 'Subscriber removed.' });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      return await newsletterService.getNewsletterStats();
    } catch (error) {
      console.error(error);
      return { total: 0, active: 0, unsubscribed: 0 };
    }
  };

  return { loading, fetchSubscribers, subscribe, unsubscribe, deleteSubscriber, getStats };
};