import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, Edit, Trash2, Rocket, PenTool, HelpCircle, FolderTree, Ticket, Store } from 'lucide-react';
import { format } from 'date-fns';

// Import Forms and Components
import AppForm from '@/components/admin/forms/AppForm';
import BlogForm from '@/components/admin/forms/BlogForm';
import FaqForm from '@/components/admin/forms/FaqForm';
import CategoryForm from '@/components/admin/forms/CategoryForm';
import CouponForm from '@/components/admin/forms/CouponForm';
import MerchantForm from '@/components/admin/forms/MerchantForm';
import DeleteConfirmationDialog from '@/components/admin/content/DeleteConfirmationDialog';

const AdminContentPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('apps');
  const [data, setData] = useState({ apps: [], blog_posts: [], faqs: [], categories: [], coupons: [], merchants: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Constants mapping
  const TAB_CONFIG = {
    apps: { table: 'apps', title: 'Applications', icon: <Rocket className="h-4 w-4" />, form: AppForm },
    blog_posts: { table: 'blog_posts', title: 'Blog Posts', icon: <PenTool className="h-4 w-4" />, form: BlogForm },
    faqs: { table: 'faqs', title: 'FAQs', icon: <HelpCircle className="h-4 w-4" />, form: FaqForm },
    categories: { table: 'categories', title: 'Categories', icon: <FolderTree className="h-4 w-4" />, form: CategoryForm },
    coupons: { table: 'coupons', title: 'Coupons', icon: <Ticket className="h-4 w-4" />, form: CouponForm },
    merchants: { table: 'merchants', title: 'Merchants', icon: <Store className="h-4 w-4" />, form: MerchantForm }
  };

  const fetchAllContent = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        supabase.from('apps').select('*, categories:apps_categories(category:categories(*))').order('created_at', {ascending: false}),
        supabase.from('blog_posts').select('*, category:categories(*)').order('created_at', {ascending: false}),
        supabase.from('faqs').select('*').order('created_at', {ascending: false}),
        supabase.from('categories').select('*').order('name'),
        supabase.from('coupons').select('*, merchant:merchants(*), category:categories(*)').order('created_at', {ascending: false}),
        supabase.from('merchants').select('*').order('name')
      ]);

      const [apps, blogs, faqs, cats, coupons, merchants] = results;
      
      // Post-process apps to flatten categories
      const processedApps = (apps.data || []).map(app => ({
          ...app,
          categories: app.categories?.map(c => c.category) || []
      }));

      setData({
        apps: processedApps,
        blog_posts: blogs.data || [],
        faqs: faqs.data || [],
        categories: cats.data || [],
        coupons: coupons.data || [],
        merchants: merchants.data || []
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error fetching data", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const handleCreateOrUpdate = async (formData) => {
    setProcessing(true);
    const table = TAB_CONFIG[activeTab].table;
    try {
      // Separate handling for apps due to many-to-many relationship
      if (activeTab === 'apps') {
         const { selectedCategories, ...appData } = formData;
         let result;
         
         if (editingItem) {
             const { data, error } = await supabase.from('apps').update(appData).eq('id', editingItem.id).select().single();
             if(error) throw error;
             result = data;
             // Update categories
             await supabase.from('apps_categories').delete().eq('app_id', result.id);
         } else {
             const { data, error } = await supabase.from('apps').insert(appData).select().single();
             if(error) throw error;
             result = data;
         }

         if (selectedCategories && selectedCategories.length > 0) {
             const catInserts = selectedCategories.map(cId => ({ app_id: result.id, category_id: cId }));
             const { error: catError } = await supabase.from('apps_categories').insert(catInserts);
             if(catError) throw catError;
         }

      } else {
         // Standard tables
         if (editingItem) {
             const { error } = await supabase.from(table).update(formData).eq('id', editingItem.id);
             if(error) throw error;
         } else {
             const { error } = await supabase.from(table).insert(formData);
             if(error) throw error;
         }
      }

      toast({ title: "Success", description: `${editingItem ? 'Updated' : 'Created'} successfully.` });
      setModalOpen(false);
      setEditingItem(null);
      fetchAllContent();
    } catch (err) {
      console.error(err);
      toast({ title: "Operation Failed", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    setProcessing(true);
    const table = TAB_CONFIG[activeTab].table;
    try {
       const { error } = await supabase.from(table).delete().eq('id', editingItem.id);
       if(error) throw error;
       toast({ title: "Deleted", description: "Item removed permanently." });
       setDeleteOpen(false);
       setEditingItem(null);
       fetchAllContent();
    } catch (err) {
       toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
       setProcessing(false);
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };
  
  const openDelete = (item) => {
    setEditingItem(item);
    setDeleteOpen(true);
  };

  const getFilteredData = () => {
    const list = data[activeTab] || [];
    if (!searchTerm) return list;
    const lower = searchTerm.toLowerCase();
    return list.filter(item => {
        // Generic search on common fields
        return (item.name?.toLowerCase().includes(lower)) || 
               (item.title?.toLowerCase().includes(lower)) ||
               (item.question?.toLowerCase().includes(lower)) ||
               (item.description?.toLowerCase().includes(lower));
    });
  };

  const filteredData = getFilteredData();
  const ActiveForm = TAB_CONFIG[activeTab].form;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>Content Manager - Admin</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
           <p className="text-muted-foreground">Create, edit, and manage all platform content from a single dashboard.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setModalOpen(true); }} className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add New {TAB_CONFIG[activeTab].title.slice(0, -1)}
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
             placeholder="Search content..." 
             value={searchTerm} 
             onChange={e => setSearchTerm(e.target.value)}
             className="border-0 focus-visible:ring-0 px-0 text-base"
          />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl overflow-x-auto">
           {Object.keys(TAB_CONFIG).map(key => (
               <TabsTrigger 
                   key={key} 
                   value={key} 
                   className="data-[state=active]:bg-white dark:data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 py-2 gap-2"
               >
                   {TAB_CONFIG[key].icon}
                   {TAB_CONFIG[key].title}
               </TabsTrigger>
           ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
           <Card className="border-0 shadow-none bg-transparent">
              {loading ? (
                  <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              ) : filteredData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl bg-card/50">
                      <p className="text-muted-foreground">No content found matching your criteria.</p>
                      <Button variant="link" onClick={() => { setEditingItem(null); setModalOpen(true); }}>Create your first item</Button>
                  </div>
              ) : (
                  <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                      <Table>
                          <TableHeader className="bg-muted/30">
                              <TableRow>
                                  {/* Dynamic Headers based on Tab */}
                                  {activeTab === 'apps' && <><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Categories</TableHead><TableHead>Featured</TableHead></>}
                                  {activeTab === 'blog_posts' && <><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Category</TableHead><TableHead>Published</TableHead></>}
                                  {activeTab === 'faqs' && <><TableHead>Question</TableHead><TableHead>Language</TableHead></>}
                                  {activeTab === 'categories' && <><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Slug</TableHead></>}
                                  {activeTab === 'coupons' && <><TableHead>Title</TableHead><TableHead>Merchant</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead></>}
                                  {activeTab === 'merchants' && <><TableHead>Name</TableHead><TableHead>Website</TableHead></>}
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {filteredData.map(item => (
                                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                                      {/* Dynamic Cells */}
                                      {activeTab === 'apps' && (
                                          <>
                                              <TableCell className="font-medium">{item.name || item.translations?.en?.name}</TableCell>
                                              <TableCell><Badge variant="outline" className={item.status === 'Production' ? 'bg-green-100 text-green-800' : ''}>{item.status}</Badge></TableCell>
                                              <TableCell className="text-muted-foreground text-sm">{item.categories?.map(c => c.name).join(', ')}</TableCell>
                                              <TableCell>{item.is_featured ? <Badge>Featured</Badge> : '-'}</TableCell>
                                          </>
                                      )}
                                      {activeTab === 'blog_posts' && (
                                          <>
                                              <TableCell className="font-medium max-w-[200px] truncate">{item.title || item.translations?.en?.title}</TableCell>
                                              <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                                              <TableCell>{item.category?.name}</TableCell>
                                              <TableCell className="text-muted-foreground text-sm">{item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : '-'}</TableCell>
                                          </>
                                      )}
                                      {activeTab === 'faqs' && (
                                          <>
                                              <TableCell className="font-medium max-w-[300px] truncate">{item.question}</TableCell>
                                              <TableCell className="uppercase text-xs font-bold text-muted-foreground">{item.language}</TableCell>
                                          </>
                                      )}
                                      {activeTab === 'categories' && (
                                          <>
                                              <TableCell className="font-medium">{item.name || item.translations?.en?.name}</TableCell>
                                              <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                                              <TableCell className="font-mono text-xs">{item.slug}</TableCell>
                                          </>
                                      )}
                                      {activeTab === 'coupons' && (
                                          <>
                                              <TableCell className="font-medium">{item.title || item.translations?.en?.title}</TableCell>
                                              <TableCell>{item.merchant?.name}</TableCell>
                                              <TableCell className="capitalize">{item.type}</TableCell>
                                              <TableCell><Badge variant={item.is_active ? "default" : "destructive"}>{item.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                                          </>
                                      )}
                                      {activeTab === 'merchants' && (
                                          <>
                                              <TableCell className="font-medium">{item.name}</TableCell>
                                              <TableCell className="text-blue-500 text-sm hover:underline"><a href={item.website_url} target="_blank" rel="noreferrer">{item.website_url}</a></TableCell>
                                          </>
                                      )}

                                      <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                              <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="hover:bg-blue-50 hover:text-blue-600">
                                                  <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="icon" onClick={() => openDelete(item)} className="hover:bg-red-50 hover:text-red-600">
                                                  <Trash2 className="h-4 w-4" />
                                              </Button>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
              )}
           </Card>
        </TabsContent>
      </Tabs>

      {/* Dynamic Form Modal */}
      {ActiveForm && (
          <ActiveForm 
              open={modalOpen} 
              onOpenChange={setModalOpen}
              initialData={editingItem}
              onSubmit={handleCreateOrUpdate}
              loading={processing}
              // Pass shared props indiscriminately, component will ignore unused ones
              categories={data.categories}
              merchants={data.merchants}
          />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog 
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          loading={processing}
          itemName={editingItem?.name || editingItem?.title || editingItem?.question || 'this item'}
      />
    </div>
  );
};

export default AdminContentPage;