/* global process */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PERMISSIONS } from '../config/adminPermissions.js';

// Load environment variables from .env file
dotenv.config();

// Verify environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env file');
  console.error('Please ensure you have a .env file in the root directory with these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedPermissions = async () => {
  console.log('🌱 Starting Permission Seeding...');

  try {
    const permissionList = Object.values(PERMISSIONS);
    const permissionsToInsert = permissionList.map(name => ({
      name,
      description: `Access to ${name.replace(':', ' ')}`,
      category: name.split(':')[0] || 'general',
      created_at: new Date()
    }));

    let successCount = 0;
    let failCount = 0;

    for (const perm of permissionsToInsert) {
      const { data: existing } = await supabase
        .from('permissions')
        .select('id')
        .eq('name', perm.name)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('permissions')
          .insert(perm);
        
        if (error) {
          console.error(`❌ Failed to insert ${perm.name}:`, error.message);
          failCount++;
        } else {
          console.log(`✅ Created permission: ${perm.name}`);
          successCount++;
        }
      } else {
        console.log(`ℹ️ Permission exists: ${perm.name}`);
      }
    }

    console.log(`\n🏁 Seeding Complete. Created: ${successCount}, Failed: ${failCount}`);
  } catch (error) {
    console.error('Unexpected error during seeding:', error);
    process.exit(1);
  }
};

seedPermissions();