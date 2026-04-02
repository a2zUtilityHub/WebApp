import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';

const CreateDiscussionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    if (!user) {
        toast({ title: 'You must be logged in', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    
    try {
        const { data: slugData, error: slugError } = await supabase.rpc('slugify', { v: formData.title });
        if(slugError) throw slugError;
        const slug = `${slugData}-${Date.now().toString().slice(-5)}`;

        const { data: threadData, error: threadError } = await supabase
            .from('discussion_threads')
            .insert({
                author_id: user.id,
                title: formData.title,
                body: formData.body,
                slug: slug,
            })
            .select()
            .single();

        if (threadError) throw threadError;

        toast({ title: 'Discussion created!', description: 'Your new thread has been posted.'});
        navigate(`/discussion/thread/${threadData.slug}`);

    } catch (error) {
        toast({ title: 'Error creating discussion', description: error.message, variant: 'destructive' });
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Start a New Discussion - A2Z Utility Hub</title>
      </Helmet>
      <div className="full-width-container py-12">
        <div className="max-w-3xl mx-auto">
            <Link to="/discussion" className="text-sm text-primary hover:underline flex items-center mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to all discussions
            </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Start a New Discussion</CardTitle>
              <CardDescription>Share your thoughts, ask a question, or provide feedback to the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    rows={10}
                    {...register('body', { required: 'Body is required' })}
                    placeholder="Write your main content here. Markdown is supported."
                  />
                  {errors.body && <p className="text-sm text-destructive mt-1">{errors.body.message}</p>}
                </div>
                {/* TODO: Add tag selection */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Discussion
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateDiscussionPage;