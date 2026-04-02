import { supabase } from '@/lib/customSupabaseClient';

export const auditLogService = {
  async logAdminAction(action, details = {}) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;

      const { error } = await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: action,
        payload: details,
        entity_type: 'admin',
        created_at: new Date().toISOString()
      });
      
      if (error) {
          console.warn('Failed to log audit (non-critical):', error.message);
      }
    } catch (err) {
      console.warn('Audit log exception (non-critical):', err);
    }
  },

  async getAuditLogs(filters = {}) {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*, profiles(email, first_name, last_name)')
        .order('created_at', { ascending: false });

      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.startDate) query = query.gte('created_at', filters.startDate);
      if (filters.endDate) query = query.lte('created_at', filters.endDate);

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return [];
    }
  },

  async exportAuditLogs() {
    try {
      const data = await this.getAuditLogs(); 
      if (!data || data.length === 0) return null;
      
      const headers = ['Date', 'User', 'Action', 'Details'];
      const rows = data.map(log => [
          log.created_at,
          log.profiles?.email || 'Unknown',
          log.action,
          JSON.stringify(log.payload)
      ]);
      
      return [headers, ...rows];
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      return null;
    }
  }
};