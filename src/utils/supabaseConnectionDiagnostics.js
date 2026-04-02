import { supabase } from '@/lib/customSupabaseClient';

export const testSupabaseConnection = async () => {
  const results = {
    clientInitialized: false,
    authConnection: false,
    databaseConnection: false,
    errors: [],
    timestamp: new Date().toISOString()
  };

  // 1. Test Client Initialization
  if (supabase) {
    results.clientInitialized = true;
  } else {
    results.errors.push("Supabase client is not initialized.");
    return results;
  }

  // 2. Test Auth Service
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    results.authConnection = true;
  } catch (error) {
    results.errors.push(`Auth Service Error: ${error.message}`);
  }

  // 3. Test Database Connection (using a common public table like 'profiles')
  try {
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
    if (dbError && dbError.code !== '42P01') { // 42P01 is undefined_table, meaning connection works but table is missing
      throw dbError;
    }
    results.databaseConnection = true;
  } catch (error) {
    results.errors.push(`Database Connection Error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`);
  }

  return results;
};

export const logDiagnostics = async () => {
  console.group('%c Supabase Diagnostics ', 'background: #222; color: #bada55; font-size: 1.2rem;');
  console.log('Running connectivity tests...');
  
  const results = await testSupabaseConnection();
  
  console.log('Client Initialized:', results.clientInitialized ? '✅' : '❌');
  console.log('Auth Connection:', results.authConnection ? '✅' : '❌');
  console.log('Database Connection:', results.databaseConnection ? '✅' : '❌');
  
  if (results.errors.length > 0) {
    console.error('Errors detected:');
    results.errors.forEach(err => console.error(`- ${err}`));
  } else {
    console.log('%c All basic Supabase services are reachable.', 'color: green;');
  }
  
  console.groupEnd();
  return results;
};