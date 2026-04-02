import React, { useState } from 'react';
import LinkListItem from './LinkListItem';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const LinkList = ({ links, setLinks }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleUpdate = (updatedLink) => {
    setLinks(links.map(l => l.id === updatedLink.id ? updatedLink : l));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      const { error } = await supabase.from('url_shortener').update({ is_deleted: true }).eq('id', id);
      if (error) throw error;
      setLinks(links.filter(l => l.id !== id));
      toast({ title: 'Link deleted successfully' });
    } catch (error) {
      toast({ title: 'Error deleting link', description: error.message, variant: 'destructive' });
    }
  };

  const filteredLinks = links
    .filter(link => 
      link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (link.custom_slug || link.short_code).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'clicks') return (b.visit_count || 0) - (a.visit_count || 0);
      return 0;
    });

  if (links.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-50 rounded-xl border border-dashed">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No links created yet</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Create your first shortened link using the form above to start tracking clicks and sharing easily.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search links..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="clicks">Most Clicks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLinks.map(link => (
          <LinkListItem 
            key={link.id} 
            link={link} 
            onUpdate={handleUpdate} 
            onDelete={handleDelete} 
          />
        ))}
        {filteredLinks.length === 0 && (
          <p className="text-center text-gray-500 py-8">No links match your search.</p>
        )}
      </div>
    </div>
  );
};

export default LinkList;