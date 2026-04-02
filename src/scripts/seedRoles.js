
/* global process */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ROLES, DEFAULT_ROLE_PERMISSIONS } from '../config/adminPermissions.js';

// Load environment variables from .env file
dotenv.config();

// Verify environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedRoles = async () => {
  console.log('🌱 Starting Role Seeding...');

  try {
    // 1. Get all permissions from DB to map names to IDs
    const { data: dbPermissions, error: permFetchError } = await supabase.from('permissions').select('id, name');
    
    if (permFetchError) {
      throw new Error(`Failed to fetch permissions: ${permFetchError.message}`);
    }

    const permMap = dbPermissions.reduce((acc, p) => ({ ...acc, [p.name]: p.id }), {});

    for (const [roleName, rolePerms] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
      console.log(`Processing role: ${roleName}`);

      // Create/Get Role
      let roleId;
      const { data: existingRole } = await supabase
          .from('roles')
          .select('id')
          .eq('name', roleName)
          .single();

      if (existingRole) {
          roleId = existingRole.id;
      } else {
          const { data: newRole, error } = await supabase
              .from('roles')
              .insert({ name: roleName, description: `Default ${roleName} role` })
              .select()
              .single();
          
          if (error) {
              console.error(`Failed to create role ${roleName}:`, error.message);
              continue;
          }
          roleId = newRole.id;
          console.log(`✅ Created role: ${roleName}`);
      }

      // Assign Permissions
      const permissionIds = [];
      
      if (rolePerms.includes('*')) {
         // Assign ALL permissions
         Object.values(permMap).forEach(id => permissionIds.push(id));
      } else {
         rolePerms.forEach(pName => {
             if (permMap[pName]) permissionIds.push(permMap[pName]);
         });
      }

      // Insert into role_permissions (bulk)
      // First clear existing to sync with config
      await supabase.from('role_permissions').delete().eq('role_id', roleId);

      const inserts = permissionIds.map(pid => ({
          role_id: roleId,
          permission_id: pid
      }));

      if (inserts.length > 0) {
          const { error: permError } = await supabase.from('role_permissions').insert(inserts);
          if (permError) console.error(`Failed to assign perms to ${roleName}`, permError);
          else console.log(`✅ Assigned ${inserts.length} permissions to ${roleName}`);
      }
    }

    console.log('\n🏁 Role Seeding Complete.');
  } catch (error) {
    console.error('Unexpected error during role seeding:', error);
    process.exit(1);
  }
};

seedRoles();
