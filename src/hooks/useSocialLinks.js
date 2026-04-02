import { useState, useCallback } from 'react';
import { socialLinksService } from '@/services/socialLinksService';
import { useToast } from '@/components/ui/use-toast';

export const useSocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      return await socialLinksService.getSocialLinks();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveLink = async (id, url, status) => {
    setLoading(true);
    try {
      await socialLinksService.updateSocialLink(id, url, status);
      toast({ title: 'Success', description: 'Link updated' });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchLinks, saveLink };
};