import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, HelpCircle } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';

const FaqForm = ({ open, onOpenChange, initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ question: '', answer: '', language: 'en' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialData || { question: '', answer: '', language: 'en' });
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.question) { setErrors({question: 'Question is required'}); return; }
    if (!formData.answer) { setErrors({answer: 'Answer is required'}); return; }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b rounded-t-xl">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
                <HelpCircle className="h-6 w-6" />
             </div>
             <DialogTitle className="text-2xl font-bold">
                {initialData ? 'Edit FAQ' : 'Create FAQ'}
             </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="space-y-2">
                <Label>Question *</Label>
                <Input 
                    value={formData.question} 
                    onChange={e => setFormData({...formData, question: e.target.value})} 
                    className={errors.question ? "border-destructive" : ""}
                />
             </div>
             <div className="space-y-2">
                <Label>Answer (Rich Text) *</Label>
                <RichTextEditor 
                    value={formData.answer} 
                    onChange={content => setFormData({...formData, answer: content})}
                />
                 {errors.answer && <p className="text-xs text-destructive">{errors.answer}</p>}
             </div>
             <div className="space-y-2">
                <Label>Language</Label>
                <Select value={formData.language} onValueChange={val => setFormData({...formData, language: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
                </Button>
             </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FaqForm;