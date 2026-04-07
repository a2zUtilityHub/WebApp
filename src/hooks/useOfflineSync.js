import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load queue from local storage
    const savedQueue = localStorage.getItem('taskManager_syncQueue');
    if (savedQueue) {
      try {
        setSyncQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse sync queue", e);
      }
    }

    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "You're back online!", description: "Synchronizing your offline changes..." });
      processSyncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: "You're offline", description: "Changes will be saved locally and synced when you reconnect.", variant: "warning" });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = useCallback((action) => {
    setSyncQueue(prev => {
      const newQueue = [...prev, { ...action, id: Date.now().toString(), timestamp: new Date().toISOString() }];
      localStorage.setItem('taskManager_syncQueue', JSON.stringify(newQueue));
      return newQueue;
    });
  }, []);

  const processSyncQueue = async () => {
    if (syncQueue.length === 0 || !isOnline || isSyncing) return;
    
    setIsSyncing(true);
    let successCount = 0;
    
    // Simulate processing queue
    for (const item of syncQueue) {
      try {
        console.log("Syncing item:", item);
        await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
        successCount++;
      } catch (error) {
        console.error("Failed to sync item", item, error);
      }
    }

    if (successCount > 0) {
      toast({ title: "Sync Complete", description: `Successfully synchronized ${successCount} items.` });
    }

    setSyncQueue([]);
    localStorage.removeItem('taskManager_syncQueue');
    setIsSyncing(false);
  };

  return { isOnline, syncQueue, addToQueue, processSyncQueue, isSyncing };
};