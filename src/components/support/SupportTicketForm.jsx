import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSupport } from '@/hooks/useSupport';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Loader2, Send } from 'lucide-react';

const SupportTicketForm = ({ onSuccess }) => {
  const { createTicket, getCategories, loading: hookLoading } = useSupport();
  const { register, handleSubmit, control, formState: { errors }, setValue, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML(), { shouldValidate: true });
    },
  });

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCats();
  }, [getCategories]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createTicket(data);
      toast({ title: 'Success', description: 'Your ticket has been created successfully.' });
      reset();
      editor?.commands.setContent('');
      if (onSuccess) onSuccess();
    } catch (e) {
      // Handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-none md:border md:shadow-sm">
      <CardHeader>
        <CardTitle>Create New Ticket</CardTitle>
        <CardDescription>
          Fill out the form below to submit a new support request. We usually respond within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Controller
                control={control}
                name="category_id"
                rules={{ required: 'Please select a category' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                control={control}
                name="priority"
                defaultValue="Low"
                rules={{ required: 'Please select priority' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low - General Question</SelectItem>
                      <SelectItem value="Medium">Medium - Minor Issue</SelectItem>
                      <SelectItem value="High">High - Major Issue</SelectItem>
                      <SelectItem value="Urgent">Urgent - System Down</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Brief summary of the issue" 
              {...register('subject', { required: 'Subject is required' })} 
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="border rounded-md">
                <div className="bg-muted/40 p-1 border-b flex gap-1">
                   <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'bg-muted' : ''}>B</Button>
                   <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'bg-muted' : ''}>I</Button>
                   <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'bg-muted' : ''}>• List</Button>
                </div>
                <EditorContent editor={editor} />
            </div>
            <input type="hidden" {...register('description', { required: 'Description is required' })} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
             <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Ticket
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportTicketForm;