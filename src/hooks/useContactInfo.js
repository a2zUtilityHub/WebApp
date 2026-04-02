import { useState, useCallback } from 'react';
import { contactInfoService } from '@/services/contactInfoService';
import { useToast } from '@/components/ui/use-toast';

export const useContactInfo = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchContactInfo = useCallback(async () => {
    setLoading(true);
    try {
      return await contactInfoService.getContactInfo();
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveContactInfo = async (data) => {
    setLoading(true);
    try {
      await contactInfoService.updateContactInfo(data);
      toast({ title: 'Success', description: 'Contact info updated' });
      return true;
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchContactInfo, saveContactInfo };
};