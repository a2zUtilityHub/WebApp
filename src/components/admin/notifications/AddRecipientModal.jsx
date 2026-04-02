import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { Loader2 } from 'lucide-react';

const AddRecipientModal = ({ open, onOpenChange, onSubmit }) => {
  const { settings } = useNotificationSettings();
  const [email, setEmail] = useState('');
  const [selectedSettings, setSelectedSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email) return;
    
    setLoading(true);
    const result = await onSubmit(email, selectedSettings);
    setLoading(false);
    
    if (result.success) {
        onOpenChange(false);
        setEmail('');
        setSelectedSettings([]);
    } else {
        setError(result.error);
    }
  };

  const toggleSetting = (id) => {
    setSelectedSettings(prev => 
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Notification Recipient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            
            <div className="space-y-2">
                <Label>Subscribe to Notifications</Label>
                <div className="border rounded-md p-3">
                    <ScrollArea className="h-[200px]">
                        {settings.map(setting => (
                             <div key={setting.id} className="flex items-center space-x-2 mb-2 last:mb-0">
                                <Checkbox 
                                    id={setting.id} 
                                    checked={selectedSettings.includes(setting.id)}
                                    onCheckedChange={() => toggleSetting(setting.id)}
                                />
                                <Label htmlFor={setting.id} className="cursor-pointer font-normal">
                                    {setting.setting_name.replace(/_/g, ' ')}
                                </Label>
                             </div>
                        ))}
                    </ScrollArea>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                    {selectedSettings.length} selected
                </p>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Recipient
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipientModal;