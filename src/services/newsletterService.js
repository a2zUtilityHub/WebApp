import { supabase } from '@/lib/customSupabaseClient';

export const newsletterService = {
  async getSubscribers({ search = '', status = 'all', page = 1, limit = 10 } = {}) {
    let query = supabase.from('newsletter_subscriptions').select('*', { count: 'exact' });

    if (search) query = query.ilike('email', `%${search}%`);
    if (status !== 'all') query = query.eq('status', status);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('subscribed_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  },

  async subscribeEmail(email) {
    // Check existing
    const { data: existing } = await supabase.from('newsletter_subscriptions').select('id, status').eq('email', email).single();
    
    if (existing) {
      if (existing.status === 'unsubscribed') {
        const { error } = await supabase.from('newsletter_subscriptions').update({ status: 'active', subscribed_at: new Date() }).eq('id', existing.id);
        if (error) throw error;
        return { message: 'Resubscribed successfully!' };
      }
      return { message: 'Already subscribed!' };
    }

    const { error } = await supabase.from('newsletter_subscriptions').insert([{ email, status: 'active' }]);
    if (error) throw error;
    return { message: 'Subscribed successfully!' };
  },

  async unsubscribeEmail(email) {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date() })
      .eq('email', email);
    if (error) throw error;
  },

  async deleteSubscriber(id) {
    const { error } = await supabase.from('newsletter_subscriptions').delete().eq('id', id);
    if (error) throw error;
  },

  async bulkDeleteSubscribers(ids) {
    const { error } = await supabase.from('newsletter_subscriptions').delete().in('id', ids);
    if (error) throw error;
  },

  async getNewsletterStats() {
    const { count: total } = await supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true });
    const { count: active } = await supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: unsubscribed } = await supabase.from('newsletter_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'unsubscribed');
    
    return { total, active, unsubscribed };
  },

  async sendNewsletter(data) {
    // In a real app, this would trigger an Edge Function or backend service
    // For now, we simulate logging to history
    const { error } = await supabase.from('newsletter_history').insert([{
      subject: data.subject,
      content: data.content,
      status: 'sent',
      sent_at: new Date(),
      recipient_count: data.recipientCount
    }]);
    if (error) throw error;
  },

  async getNewsletterHistory({ page = 1, limit = 10 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, count, error } = await supabase
      .from('newsletter_history')
      .select('*', { count: 'exact' })
      .order('sent_at', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    return { data, count };
  }
};