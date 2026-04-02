import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const SendNotificationModal = ({ open, onOpenChange, onSend }) => {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    message: '',
    type: 'system'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Recipient email is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (formData.message.length > 500) newErrors.message = 'Message too long (max 500 chars)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const success = await onSend(formData);
    setLoading(false);

    if (success) {
      setFormData({ email: '', title: '', message: '', type: 'system' });
      onOpenChange(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Notification Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className={errors.message ? "border-red-500 min-h-[100px]" : "min-h-[100px]"}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>{errors.message ? <span className="text-red-500">{errors.message}</span> : ""}</span>
                <span>{formData.message.length}/500</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Notification
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationModal;