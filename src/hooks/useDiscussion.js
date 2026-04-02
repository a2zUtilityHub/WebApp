import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { executeQuery, SupabaseError } from '@/utils/supabaseErrorHandler';

export const useDiscussion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscussionThreads = useCallback(async ({ page = 1, limit = 10, searchQuery = '' } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('discussion_threads')
        .select(`
          *,
          author:profiles!discussion_threads_author_id_fkey(first_name, avatar_url),
          tags:discussion_thread_tags_join(thread_tags(name, slug)),
          comments:comments!comments_thread_id_fkey(count)
        `, { count: 'exact' });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      query = query
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, count, error: err } = await executeQuery(() => query);

      if (err) throw err;

      return { data, count };
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError(err instanceof SupabaseError ? err.message : "Failed to fetch discussions");
      return { data: [], count: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscussionThread = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await executeQuery(() => 
        supabase
          .from('discussion_threads')
          .select(`
            *,
            author:profiles!discussion_threads_author_id_fkey(first_name, avatar_url),
            tags:discussion_thread_tags_join(thread_tags(name, slug))
          `)
          .eq('slug', slug)
          .single()
      );

      if (err) throw err;
      return data;
    } catch (err) {
      console.error("Error fetching thread:", err);
      setError(err instanceof SupabaseError ? err.message : "Failed to fetch thread");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchDiscussionThreads,
    fetchDiscussionThread
  };
};