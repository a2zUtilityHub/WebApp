import { supabase } from '@/lib/customSupabaseClient';

/**
 * Audits critical tables to verify data exists and RLS allows access.
 */
export const runDatabaseAudit = async () => {
  console.log('--- Starting Database Audit ---');
  
  const tables = [
    { name: 'apps', filter: q => q.in('status', ['published', 'Production', 'active']) },
    { name: 'coupons', filter: q => q.or('status.eq.published,is_active.eq.true') },
    { name: 'blog_posts', filter: q => q.eq('status', 'published') },
    { name: 'testimonials', filter: q => q.eq('is_featured', true) }
  ];

  for (const table of tables) {
    try {
      let query = supabase.from(table.name).select('id', { count: 'exact', head: true });
      if (table.filter) {
        query = table.filter(query);
      }
      
      const { count, error } = await query;
      
      if (error) {
        console.error(`[Audit] ❌ Error checking ${table.name}:`, error.message);
      } else {
        console.log(`[Audit] ✅ ${table.name}: ${count} accessible records found.`);
      }
    } catch (err) {
       console.error(`[Audit] ❌ Exception checking ${table.name}:`, err);
    }
  }
  
  console.log('--- Database Audit Complete ---');
};