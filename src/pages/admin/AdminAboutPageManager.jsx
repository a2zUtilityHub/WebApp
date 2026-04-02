import React, { useState, useEffect } from 'react';
import { useAboutPage } from '@/hooks/useAboutPage';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminAboutPageManager = () => {
    const { getAboutPageContent, updateAboutPageContent, getAboutPageVisibility, toggleAboutPageVisibility, loading } = useAboutPage();
    const [content, setContent] = useState({});
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getAboutPageContent();
            const visible = await getAboutPageVisibility();
            
            const contentMap = {};
            data.forEach(item => {
                contentMap[item.section_name] = item.section_content;
            });
            setContent(contentMap);
            setIsVisible(visible);
        };
        load();
    }, [getAboutPageContent, getAboutPageVisibility]);

    const handleSave = async (section) => {
        await updateAboutPageContent(section, content[section]);
    };

    const handleVisibilityToggle = async (val) => {
        setIsVisible(val);
        await toggleAboutPageVisibility(val);
    };

    const SectionEditor = ({ sectionKey, title, description }) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    value={content[sectionKey] || ''} 
                    onChange={(e) => setContent(prev => ({ ...prev, [sectionKey]: e.target.value }))}
                    className="min-h-[200px]"
                    placeholder="Enter content (HTML supported)..."
                />
                <Button onClick={() => handleSave(sectionKey)} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    <Save className="mr-2 h-4 w-4"/> Save Section
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">About Page Manager</h1>
                    <Breadcrumbs items={[{ title: "Dashboard", to: "/admin/dashboard" }, { title: "About Us Manager", to: "#" }]} />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Label>Page Visibility</Label>
                        <Switch checked={isVisible} onCheckedChange={handleVisibilityToggle} />
                    </div>
                    <Button variant="outline" onClick={() => window.open('/about-us', '_blank')}>
                        <Eye className="mr-2 h-4 w-4"/> Preview Page
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="flex flex-wrap h-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="values">Values</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                    <SectionEditor 
                        sectionKey="overview" 
                        title="Company Overview" 
                        description="The main introduction text displayed at the top of the About Us page."
                    />
                </TabsContent>
                
                <TabsContent value="mission" className="mt-4">
                    <div className="grid gap-6">
                        <SectionEditor sectionKey="mission" title="Mission Statement" description="What drives us." />
                        <SectionEditor sectionKey="vision" title="Vision Statement" description="Where we are going." />
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                     <SectionEditor sectionKey="history" title="Company History" description="Timeline and milestones." />
                </TabsContent>

                <TabsContent value="values" className="mt-4">
                     <SectionEditor sectionKey="values" title="Core Values" description="Our culture and beliefs." />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminAboutPageManager;