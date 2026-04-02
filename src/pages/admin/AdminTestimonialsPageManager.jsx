import React from 'react';
import AdminTestimonialsManager from './AdminTestimonialsManager'; // Reusing existing if possible or creating basic
// Since the prompt asks to create it, I will implement a basic version or redirect to the existing one if it exists.
// Looking at file list: src/pages/admin/AdminTestimonialsManager.jsx exists.
// I'll assume that one is sufficient for managing testimonials themselves, but maybe we need page-level settings (header text).

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminTestimonialsPageManager = () => {
    const [headerText, setHeaderText] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            // Load page visibility
            const { data: page } = await supabase.from('pages').select('is_visible').eq('slug', 'testimonials').maybeSingle();
            if (page) setIsVisible(page.is_visible);

            // Load header content from page_content
            const { data: content } = await supabase.from('page_content').select('section_content').eq('page_slug', 'testimonials').eq('section_name', 'header').maybeSingle();
            if (content) setHeaderText(content.section_content);
        };
        load();
    }, []);

    const handleSaveHeader = async () => {
         const { data: existing } = await supabase.from('page_content').select('id').eq('page_slug', 'testimonials').eq('section_name', 'header').maybeSingle();
         if (existing) {
             await supabase.from('page_content').update({ section_content: headerText }).eq('id', existing.id);
         } else {
             await supabase.from('page_content').insert({ page_slug: 'testimonials', section_name: 'header', section_content: headerText });
         }
         alert('Saved!');
    };

    const handleToggleVisibility = async (val) => {
        setIsVisible(val);
        const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'testimonials').maybeSingle();
        if (existing) {
            await supabase.from('pages').update({ is_visible: val }).eq('id', existing.id);
        } else {
            await supabase.from('pages').insert({ slug: 'testimonials', title: 'Testimonials', status: 'published', is_visible: val });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Testimonials Page Manager</h1>
                    <Breadcrumbs items={[{ title: "Dashboard", to: "/admin/dashboard" }, { title: "Testimonials Page", to: "#" }]} />
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label>Visibility</Label>
                        <Switch checked={isVisible} onCheckedChange={handleToggleVisibility} />
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Label>Intro Text</Label>
                    <Textarea value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="What our users say..." />
                    <Button onClick={handleSaveHeader}>Save Header</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Manage Testimonials</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Go to the dedicated Testimonials Manager to approve/delete individual reviews.</p>
                    <Button asChild><a href="/admin/testimonials">Go to Testimonials Manager</a></Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminTestimonialsPageManager;