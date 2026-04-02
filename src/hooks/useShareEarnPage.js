import { useState, useCallback } from 'react';
import { shareEarnPageService } from '@/services/shareEarnPageService';
import { useToast } from '@/components/ui/use-toast';

export const useShareEarnPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getPageContent = useCallback(async () => {
    setLoading(true);
    const { data } = await shareEarnPageService.getPageContent();
    setLoading(false);
    return data || [];
  }, []);

  const updatePageContent = async (sectionName, content) => {
    setLoading(true);
    const { success } = await shareEarnPageService.updatePageContent(sectionName, content);
    setLoading(false);
    if(success) toast({ title: "Saved", description: "Content updated." });
    return success;
  };

  const getVisibility = useCallback(async () => {
      const { isVisible } = await shareEarnPageService.getVisibility();
      return isVisible;
  }, []);

  const toggleVisibility = async (isVisible) => {
      setLoading(true);
      const { success } = await shareEarnPageService.toggleVisibility(isVisible);
      setLoading(false);
      if(success) toast({ title: "Success", description: "Visibility updated." });
      return success;
  };

  return { loading, getPageContent, updatePageContent, getVisibility, toggleVisibility };
};