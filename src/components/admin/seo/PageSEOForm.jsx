import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Loader2, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MultiInput = ({ label, values = [], onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            onChange([...values, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemove = (index) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Input 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                <Button type="button" onClick={handleAdd} size="icon" variant="outline"><Plus className="h-4 w-4"/></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {values.map((val, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        {val}
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => handleRemove(idx)} />
                    </Badge>
                ))}
            </div>
        </div>
    );
};

const PageSEOForm = ({ open, onClose, initialData, onSuccess }) => {
    const { createSEOPage, updateSEOPage, loading } = useAdminSEO();
    const [formData, setFormData] = useState({
        page_url: '',
        page_title: '',
        meta_description: '',
        meta_keywords: [],
        h1_tag: '',
        h2_tags: [],
        h3_tags: [],
        image_alt_text: [],
        canonical_url: '',
        robots_meta: 'index, follow',
        sitemap_included: true
    });

    useEffect(() => {
        if(initialData) {
            setFormData({
                ...initialData,
                meta_keywords: Array.isArray(initialData.meta_keywords) ? initialData.meta_keywords : [],
                h2_tags: Array.isArray(initialData.h2_tags) ? initialData.h2_tags : [],
                h3_tags: Array.isArray(initialData.h3_tags) ? initialData.h3_tags : [],
                image_alt_text: Array.isArray(initialData.image_alt_text) ? initialData.image_alt_text : []
            });
        } else {
             setFormData({
                page_url: '',
                page_title: '',
                meta_description: '',
                meta_keywords: [],
                h1_tag: '',
                h2_tags: [],
                h3_tags: [],
                image_alt_text: [],
                canonical_url: '',
                robots_meta: 'index, follow',
                sitemap_included: true
            });
        }
    }, [initialData, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = initialData 
            ? await updateSEOPage(initialData.id, formData)
            : await createSEOPage(formData);
        
        if(success) {
            onSuccess?.();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle>{initialData ? 'Edit Page SEO' : 'Add New Page SEO'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6">
                    <form id="seo-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Page URL <span className="text-red-500">*</span></Label>
                                <Input required value={formData.page_url} onChange={e => setFormData({...formData, page_url: e.target.value})} placeholder="/about" />
                            </div>
                            <div className="space-y-2">
                                <Label>Page Title</Label>
                                <Input value={formData.page_title} onChange={e => setFormData({...formData, page_title: e.target.value})} placeholder="About Us | Company Name" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Meta Description</Label>
                            <Textarea 
                                value={formData.meta_description} 
                                onChange={e => setFormData({...formData, meta_description: e.target.value})} 
                                placeholder="Brief description of the page for search engines..."
                                className="h-20"
                            />
                        </div>

                        <MultiInput 
                            label="Meta Keywords" 
                            values={formData.meta_keywords} 
                            onChange={vals => setFormData({...formData, meta_keywords: vals})}
                            placeholder="Add keyword and press Enter"
                        />

                        <div className="space-y-2">
                            <Label>H1 Tag</Label>
                            <Input value={formData.h1_tag} onChange={e => setFormData({...formData, h1_tag: e.target.value})} placeholder="Main Heading" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MultiInput 
                                label="H2 Tags" 
                                values={formData.h2_tags} 
                                onChange={vals => setFormData({...formData, h2_tags: vals})}
                                placeholder="Add H2 and press Enter"
                            />
                             <MultiInput 
                                label="H3 Tags" 
                                values={formData.h3_tags} 
                                onChange={vals => setFormData({...formData, h3_tags: vals})}
                                placeholder="Add H3 and press Enter"
                            />
                        </div>

                         <MultiInput 
                            label="Image Alt Texts" 
                            values={formData.image_alt_text} 
                            onChange={vals => setFormData({...formData, image_alt_text: vals})}
                            placeholder="Add alt text and press Enter"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Canonical URL</Label>
                                <Input value={formData.canonical_url} onChange={e => setFormData({...formData, canonical_url: e.target.value})} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Robots Meta</Label>
                                <Input value={formData.robots_meta} onChange={e => setFormData({...formData, robots_meta: e.target.value})} placeholder="index, follow" />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                            <Switch checked={formData.sitemap_included} onCheckedChange={c => setFormData({...formData, sitemap_included: c})} />
                            <Label>Include in Sitemap</Label>
                        </div>
                    </form>
                </ScrollArea>
                <DialogFooter className="p-6 pt-2 border-t mt-auto bg-muted/20">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="seo-form" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PageSEOForm;