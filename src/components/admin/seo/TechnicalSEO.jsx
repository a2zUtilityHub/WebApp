import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SitemapManagement from './SitemapManagement';
import RobotsManagement from './RobotsManagement';
import MetaTagsManagement from './MetaTagsManagement';
import SchemaMarkupManagement from './SchemaMarkupManagement';

const TechnicalSEO = () => {
    return (
        <Tabs defaultValue="sitemap" className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                <TabsTrigger value="robots">Robots.txt</TabsTrigger>
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                <TabsTrigger value="schema">Schema Markup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sitemap"><SitemapManagement /></TabsContent>
            <TabsContent value="robots"><RobotsManagement /></TabsContent>
            <TabsContent value="meta"><MetaTagsManagement /></TabsContent>
            <TabsContent value="schema"><SchemaMarkupManagement /></TabsContent>
        </Tabs>
    );
};

export default TechnicalSEO;