import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, FileText, BarChart3, Link as LinkIcon, FileCode, Search, ShieldCheck } from 'lucide-react';
import SEODashboard from '@/components/admin/seo/SEODashboard';
import PageSEOList from '@/components/admin/seo/PageSEOList';
import PageSEOForm from '@/components/admin/seo/PageSEOForm';
import TechnicalSEO from '@/components/admin/seo/TechnicalSEO';
import KeywordManagement from '@/components/admin/seo/KeywordManagement';
import BacklinksManagement from '@/components/admin/seo/BacklinksManagement';
import SEOAudit from '@/components/admin/seo/SEOAudit';
import SEOReports from '@/components/admin/seo/SEOReports';

const AdminSEOPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState(null);

    const handleCreate = () => {
        setEditingPage(null);
        setModalOpen(true);
    };

    const handleEdit = (page) => {
        setEditingPage(page);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Helmet><title>SEO Management | Admin</title></Helmet>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-6 rounded-2xl shadow-sm border backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SEO Manager</h1>
                    <p className="text-muted-foreground mt-1">Optimize your site's search engine performance and visibility.</p>
                </div>
                <div className="flex items-center gap-2">
                     {/* Global Actions could go here */}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card shadow-sm p-1.5 h-auto flex-wrap justify-start border w-full md:w-auto inline-flex rounded-xl">
                    <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><LayoutDashboard className="h-4 w-4"/> Dashboard</TabsTrigger>
                    <TabsTrigger value="pages" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><FileText className="h-4 w-4"/> Pages</TabsTrigger>
                    <TabsTrigger value="keywords" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><BarChart3 className="h-4 w-4"/> Keywords</TabsTrigger>
                    <TabsTrigger value="backlinks" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><LinkIcon className="h-4 w-4"/> Backlinks</TabsTrigger>
                    <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><ShieldCheck className="h-4 w-4"/> Audit</TabsTrigger>
                    <TabsTrigger value="tech" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><FileCode className="h-4 w-4"/> Technical</TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"><FileText className="h-4 w-4"/> Reports</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="dashboard" className="space-y-4 focus-visible:outline-none">
                        <SEODashboard />
                    </TabsContent>

                    <TabsContent value="pages" className="space-y-4 focus-visible:outline-none">
                        <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <PageSEOList onCreate={handleCreate} onEdit={handleEdit} onView={() => {}} />
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="keywords" className="space-y-4 focus-visible:outline-none">
                         <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <KeywordManagement />
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="backlinks" className="space-y-4 focus-visible:outline-none">
                         <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <BacklinksManagement />
                        </Card>
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-4 focus-visible:outline-none">
                         <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <SEOAudit />
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="tech" className="space-y-4 focus-visible:outline-none">
                        <TechnicalSEO />
                    </TabsContent>

                     <TabsContent value="reports" className="space-y-4 focus-visible:outline-none">
                        <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                            <SEOReports />
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            <PageSEOForm 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                initialData={editingPage}
                onSuccess={() => { 
                    // This forces a re-render/refetch in list if handled via context or key, 
                    // for now simply closing. Ideally trigger a refetch in list.
                    setModalOpen(false);
                }}
            />
        </div>
    );
};

export default AdminSEOPage;