import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Upload, Mail, KeyRound, Calendar as CalendarIcon, Bold, Italic, List, Link } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useDropzone } from 'react-dropzone';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';

const AvatarUploadDialog = ({ userProfile, onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      setCroppedImage(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const handleUpload = async () => {
    if (!croppedImage) return;
    setLoading(true);
    
    const response = await fetch(croppedImage);
    const blob = await response.blob();
    const fileName = `${userProfile.id}/${Date.now()}.png`;
    
    const { data, error } = await supabase.storage
      .from('public_uploads')
      .upload(`avatars/${fileName}`, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('public_uploads').getPublicUrl(`avatars/${fileName}`);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userProfile.id);

    if (updateError) {
      toast({ title: 'Update failed', description: updateError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile picture updated!' });
      onUploadComplete(userProfile.id);
      setOpen(false);
      setImage(null);
      setCroppedImage(null);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!image && (
            <div {...getRootProps()} className="p-10 border-2 border-dashed rounded-md text-center cursor-pointer">
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop an image here, or click to select</p>}
            </div>
          )}
          {image && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Crop Image</h4>
                <Cropper
                  ref={cropperRef}
                  src={image}
                  style={{ height: 250, width: '100%' }}
                  aspectRatio={1}
                  guides={false}
                  crop={onCrop}
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preview</h4>
                {croppedImage && <img src={croppedImage} alt="Cropped Preview" className="w-40 h-40 rounded-full mx-auto" />}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setImage(null); setCroppedImage(null); }}>Reset</Button>
          <Button onClick={handleUpload} disabled={!croppedImage || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Upload & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const ChangeEmailDialog = ({ userProfile, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: data.newEmail });
    if (error) {
      toast({ title: "Error changing email", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Confirmation required", description: "A confirmation email has been sent to your new address. Please verify to complete the change." });
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Change Email</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Change Email Address</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">Current email: {userProfile.email}</p>
          <div>
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input id="newEmail" type="email" {...register('newEmail', { required: "New email is required" })} />
            {errors.newEmail && <p className="text-destructive text-sm mt-1">{errors.newEmail.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Confirmation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ChangePasswordDialog = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    if (error) {
      toast({ title: "Error changing password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Your password has been changed." });
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><KeyRound className="mr-2 h-4 w-4" /> Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register('newPassword', { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} />
            {errors.newPassword && <p className="text-destructive text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword', { required: "Please confirm your password", validate: value => value === newPassword || "Passwords do not match" })} />
            {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save New Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b border-border/50 bg-muted/30 p-2 flex items-center gap-1">
      <Button type="button" variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4"/></Button>
      <Button type="button" variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4"/></Button>
      <Button type="button" variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4"/></Button>
      <Button type="button" variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8 rounded-lg" onClick={setLink}><Link className="h-4 w-4"/></Button>
    </div>
  );
};

const ProfileSection = ({ userProfile, onProfileUpdate, profileCompletion }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const defaultValues = {
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    dob: userProfile?.dob ? new Date(userProfile.dob) : null,
    gender: userProfile?.gender || '',
    country: userProfile?.country || '',
    state: userProfile?.state || '',
    city: userProfile?.city || '',
    zip_code: userProfile?.zip_code || '',
  };

  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm({ defaultValues });

  const editor = useEditor({
    extensions: [StarterKit.configure({
        heading: false,
        strike: false,
        codeBlock: false,
        blockquote: false,
      }), TiptapLink.configure({
        openOnClick: false,
      })],
    content: userProfile?.bio || '',
    editorProps: {
        attributes: {
          class: 'prose dark:prose-invert min-h-[120px] max-w-none bg-transparent px-4 py-3 text-[15px] focus:outline-none',
        },
      },
    onUpdate: ({ editor }) => {
      setValue('bio', editor.getHTML(), { shouldValidate: true });
    },
  });

  useEffect(() => {
    reset(defaultValues);
    editor?.commands.setContent(userProfile?.bio || '');
  }, [userProfile, reset, editor]);

  const onSubmit = async (data) => {
    setLoading(true);
    const updateData = { ...data, bio: editor.getHTML() };
    if (data.dob) {
      updateData.dob = format(data.dob, 'yyyy-MM-dd');
    }
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userProfile.id);

    if (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
      onProfileUpdate(userProfile.id);
    }
    setLoading(false);
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <Card className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 to-primary"></div>
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">My Profile</CardTitle>
        <CardDescription className="text-[15px]">Update your personal information and manage your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-muted/20 rounded-2xl border border-border/50">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
            <AvatarImage src={userProfile.avatar_url} alt="Profile picture" className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-2xl font-bold">{getInitials(userProfile.first_name, userProfile.last_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow w-full">
            <div className="flex justify-between items-end mb-2">
               <p className="text-sm font-semibold text-foreground">Profile Completion</p>
               <p className="text-xs font-bold text-primary">{profileCompletion}%</p>
            </div>
            <Progress value={profileCompletion} className="h-2.5 w-full bg-muted/50 [&>div]:bg-gradient-to-r [&>div]:from-primary/60 [&>div]:to-primary" />
            <p className="text-[13px] text-muted-foreground mt-2">Complete your profile to unlock all features.</p>
          </div>
          <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
             <AvatarUploadDialog userProfile={userProfile} onUploadComplete={onProfileUpdate} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Input id="firstName" label="First Name" {...register('first_name')} />
            </div>
            <div className="space-y-1.5">
              <Input id="lastName" label="Last Name" {...register('last_name')} />
            </div>
            <div className="space-y-1.5 group">
              <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">Date of Birth</Label>
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full h-12 rounded-xl bg-background/60 backdrop-blur-sm border-input hover:border-primary/50 transition-colors shadow-sm focus-visible:ring-4 focus-visible:ring-primary/10 justify-start text-left font-normal text-[15px]", !field.value && "text-muted-foreground/60")}
                      >
                        <CalendarIcon className="mr-3 h-[18px] w-[18px] text-muted-foreground group-focus-within:text-primary transition-colors" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">
                      <Calendar 
                        mode="single" 
                        selected={field.value} 
                        onSelect={field.onChange} 
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")} 
                        initialFocus
                        captionLayout="dropdown-nav"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                       />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-1.5 group">
              <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="h-12 rounded-xl bg-background/60 backdrop-blur-sm border-input hover:border-primary/50 transition-colors shadow-sm focus:ring-4 focus:ring-primary/10 text-[15px]"><SelectValue placeholder="Select a gender" /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl shadow-xl">
                      <SelectItem value="male" className="rounded-xl focus:bg-primary/10">Male</SelectItem>
                      <SelectItem value="female" className="rounded-xl focus:bg-primary/10">Female</SelectItem>
                      <SelectItem value="other" className="rounded-xl focus:bg-primary/10">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say" className="rounded-xl focus:bg-primary/10">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-1.5 group mt-6">
            <Label className="text-[14px] font-medium text-foreground/90 group-focus-within:text-primary transition-colors">About You / Bio</Label>
            <div className="rounded-2xl overflow-hidden border border-input focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all duration-300 shadow-sm bg-background/60 backdrop-blur-sm">
               <EditorToolbar editor={editor} />
               <EditorContent editor={editor} />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <Input id="country" label="Country" {...register('country')} />
              </div>
              <div className="space-y-1.5">
                <Input id="state" label="State / Province" {...register('state')} />
              </div>
              <div className="space-y-1.5">
                <Input id="city" label="City" {...register('city')} />
              </div>
              <div className="space-y-1.5">
                <Input id="zip_code" label="Zip / Postal Code" {...register('zip_code')} />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="h-12 rounded-xl px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Save Profile Changes
            </Button>
          </div>
        </form>

        <div className="space-y-4 pt-8 mt-8 border-t border-border/50">
          <h3 className="font-semibold text-lg">Account Security</h3>
          <div className="grid gap-4">
            <div className="p-5 border border-border/50 bg-background/40 backdrop-blur-sm rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-all duration-300">
              <div>
                <p className="font-semibold text-foreground">Email Address</p>
                <p className="text-sm text-muted-foreground mt-0.5">{userProfile.email}</p>
              </div>
              <ChangeEmailDialog userProfile={userProfile} onUpdate={onProfileUpdate} />
            </div>
            <div className="p-5 border border-border/50 bg-background/40 backdrop-blur-sm rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-sm transition-all duration-300">
              <div>
                <p className="font-semibold text-foreground">Password</p>
                <p className="text-sm text-muted-foreground mt-0.5">Last changed recently</p>
              </div>
              <ChangePasswordDialog />
            </div>
          </div>
        </div>
      </CardContent>
      </Card>
  );
};

export default ProfileSection;