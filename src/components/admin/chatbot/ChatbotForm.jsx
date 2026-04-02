import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useChatbotManagement } from '@/hooks/useChatbotManagement';

const ChatbotForm = ({ open, onClose, initialData, onSuccess }) => {
    const { createChatbot, updateChatbot, loading } = useChatbotManagement();
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: initialData || { status: 'active', type: 'AI', language: 'en' }
    });

    const onSubmit = async (data) => {
        let result;
        if (initialData) result = await updateChatbot(initialData.id, data);
        else result = await createChatbot(data);

        if (result) {
            onSuccess();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Chatbot' : 'Create Chatbot'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input {...register('name', { required: true })} placeholder="e.g. Support Bot" />
                        </div>
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select onValueChange={v => setValue('language', v)} defaultValue={initialData?.language || 'en'}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select onValueChange={v => setValue('type', v)} defaultValue={initialData?.type || 'AI'}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AI">AI Powered</SelectItem>
                                    <SelectItem value="rule-based">Rule Based</SelectItem>
                                    <SelectItem value="hybrid">Hybrid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Status</Label>
                            <Select onValueChange={v => setValue('status', v)} defaultValue={initialData?.status || 'active'}>
                                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...register('description')} placeholder="What does this bot do?" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Chatbot'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChatbotForm;