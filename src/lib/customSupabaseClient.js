import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emgfcirrbenkwczlfcof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtZ2ZjaXJyYmVua3djemxmY29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjgyOTUsImV4cCI6MjA3MjUwNDI5NX0.dax_Lv126OrP0JUS8K8OKOhkItkXBYohQCymXhiwgpM';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
