import { useState, useCallback } from 'react';
import { contactPageService } from '@/services/contactPageService';
import { useToast } from '@/components/ui/use-toast';

export const useContactPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getContactPageContent = useCallback(async () => {
    setLoading(true);
    const contentRes = await contactPageService.getContactPageContent();
    const settingsRes = await contactPageService.getContactSettings();
    setLoading(false);
    return { 
        content: contentRes.data || [], 
        settings: settingsRes.data || {} 
    };
  }, []);

  const updateContactPageContent = async (sectionName, content) => {
    setLoading(true);
    const { success, error } = await contactPageService.updateContactPageContent(sectionName, content);
    setLoading(false);
    if (success) toast({ title: "Updated", description: "Content saved." });
    else toast({ title: "Error", description: error.message, variant: "destructive" });
    return success;
  };

  const updateContactSettings = async (key, value) => {
    setLoading(true);
    const { success, error } = await contactPageService.updateContactSettings(key, value);
    setLoading(false);
    if (success) toast({ title: "Updated", description: "Settings saved." });
    else toast({ title: "Error", description: error.message, variant: "destructive" });
    return success;
  };
  
  const getContactPageVisibility = useCallback(async () => {
      const { isVisible } = await contactPageService.getContactPageVisibility();
      return isVisible;
  }, []);

  const toggleContactPageVisibility = async (isVisible) => {
      setLoading(true);
      const { success } = await contactPageService.toggleContactPageVisibility(isVisible);
      setLoading(false);
      if (success) toast({ title: "Success", description: `Page is now ${isVisible ? 'visible' : 'hidden'}` });
      return success;
  };

  return {
    loading,
    getContactPageContent,
    updateContactPageContent,
    updateContactSettings,
    getContactPageVisibility,
    toggleContactPageVisibility
  };
};