import { useState, useCallback } from 'react';
import { aboutPageService } from '@/services/aboutPageService';
import { useToast } from '@/components/ui/use-toast';

export const useAboutPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getAboutPageContent = useCallback(async () => {
    setLoading(true);
    try {
      const { success, data, error } = await aboutPageService.getAboutPageContent();
      if (!success) throw error;
      return data;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAboutPageContent = async (sectionName, content) => {
    setLoading(true);
    try {
      const { success, error } = await aboutPageService.updateAboutPageContent(sectionName, content);
      if (!success) throw error;
      toast({ title: "Success", description: "Content updated successfully" });
      return true;
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAboutPageVisibility = useCallback(async () => {
    const { success, isVisible } = await aboutPageService.getAboutPageVisibility();
    return success ? isVisible : true;
  }, []);

  const toggleAboutPageVisibility = async (isVisible) => {
    setLoading(true);
    try {
      const { success, error } = await aboutPageService.toggleAboutPageVisibility(isVisible);
      if (!success) throw error;
      toast({ title: "Success", description: `Page is now ${isVisible ? 'visible' : 'hidden'}` });
      return true;
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAboutPageContent,
    updateAboutPageContent,
    getAboutPageVisibility,
    toggleAboutPageVisibility
  };
};