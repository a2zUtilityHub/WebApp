import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const QRLogoUpload = ({ onLogoUpload, currentLogo }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a PNG, JPG, GIF, or SVG image.", variant: "destructive" });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
      return;
    }

    if (!session) {
      toast({ title: "Authentication required", description: "Please log in to upload custom logos.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `qr-logos/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('public_uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('public_uploads')
        .getPublicUrl(filePath);

      onLogoUpload(publicUrlData.publicUrl);
      toast({ title: 'Logo uploaded successfully!' });

    } catch (error) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemove = () => {
    onLogoUpload(null);
  };

  return (
    <div className="space-y-4 pt-4">
      <Label>Center Logo</Label>
      
      {!currentLogo ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/gif, image/svg+xml" 
            onChange={handleFileChange} 
          />
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          ) : (
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
          )}
          <p className="text-sm font-medium text-gray-700">
            {isUploading ? 'Uploading...' : 'Click to upload logo'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="w-16 h-16 bg-white border rounded-md flex items-center justify-center overflow-hidden">
            <img src={currentLogo} alt="Uploaded logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Custom Logo</p>
            <p className="text-xs text-green-600">Uploaded successfully</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="text-red-500 hover:text-red-700 hover:bg-red-50">
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRLogoUpload;