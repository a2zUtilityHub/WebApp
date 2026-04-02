import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const EditLinkModal = ({ isOpen, onClose, link, onUpdate }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    custom_slug: '',
    expires_at: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (link) {
      setFormData({
        custom_slug: link.custom_slug || link.short_code || '',
        expires_at: link.expires_at ? new Date(link.expires_at).toISOString().slice(0, 16) : '',
        password: '' // Don't show existing password
      });
    }
  }, [link]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!link) return;
    setIsSubmitting(true);

    try {
      const updates = {
        custom_slug: formData.custom_slug || null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      };

      if (formData.password) {
        // In a real app, hash this before sending or let backend handle it.
        updates.password = formData.password; 
      }

      const { data, error } = await supabase
        .from('url_shortener')
        .update(updates)
        .eq('id', link.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast({ title: 'Link updated successfully' });
      onClose();
    } catch (error) {
      toast({ title: 'Error updating link', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="custom_slug">Custom Alias (Slug)</Label>
            <Input
              id="custom_slug"
              name="custom_slug"
              value={formData.custom_slug}
              onChange={handleChange}
              placeholder="e.g., my-campaign"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
            <Input
              id="expires_at"
              name="expires_at"
              type="datetime-local"
              value={formData.expires_at}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password Protection (Optional)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep unchanged"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLinkModal;