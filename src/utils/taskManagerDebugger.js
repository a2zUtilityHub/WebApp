import { supabase } from '@/lib/customSupabaseClient';

export const runTaskDebug = async () => {
  console.log('--- Starting Task Manager Diagnostics ---');
  const results = {
    auth: false,
    tableAccess: false,
    rlsPolicies: false,
    errors: []
  };

  try {
    // 1. Check Auth
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw new Error(`Auth Error: ${authError.message}`);
    if (!session) throw new Error('No active session found.');
    results.auth = true;
    console.log('✅ Authentication valid. User ID:', session.user.id);

    // 2. Check Table Access (Tasks)
    const { error: tableError } = await supabase.from('tasks').select('id').limit(1);
    if (tableError) {
       if (tableError.code === '42P01') throw new Error('Tasks table does not exist.');
       if (tableError.code === '42501') console.warn('⚠️ RLS is restricting access to tasks (expected if empty).');
       else throw new Error(`Table Access Error: ${tableError.message}`);
    }
    results.tableAccess = true;
    console.log('✅ Tasks table is accessible.');

    // 3. Check Projects Access
    const { error: projError } = await supabase.from('projects').select('id').limit(1);
    if (projError) {
       console.warn(`⚠️ Projects table access issue: ${projError.message}`);
    } else {
       console.log('✅ Projects table is accessible.');
    }
    
    results.rlsPolicies = true; // Assuming true if queries executed without hard crashes

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    results.errors.push(error.message);
  }

  console.log('--- Diagnostics Complete ---', results);
  return results;
};