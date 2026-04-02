
/* global process */
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Make sure to have a .env file at the root with these variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: Missing Supabase URL or Service Role Key.");
  console.error("Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in your .env file.");
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const DEMO_USER_EMAIL = process.env.TEST_USER_EMAIL;
const DEMO_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;

if (!DEMO_USER_EMAIL || !DEMO_ADMIN_EMAIL) {
    console.error("Error: TEST_USER_EMAIL and TEST_ADMIN_EMAIL must be set in your .env file.");
    process.exit(1);
}

const main = async () => {
  console.log("Starting demo data refresh...");

  try {
    // 1. Get user IDs
    console.log("Fetching user IDs...");
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const demoUser = users.users.find(u => u.email === DEMO_USER_EMAIL);
    const adminUser = users.users.find(u => u.email === DEMO_ADMIN_EMAIL);

    if (!demoUser) {
      console.error(`Demo user with email ${DEMO_USER_EMAIL} not found.`);
      return;
    }
     if (!adminUser) {
      console.error(`Admin user with email ${DEMO_ADMIN_EMAIL} not found.`);
      return;
    }

    const demoUserId = demoUser.id;
    const adminUserId = adminUser.id;
    console.log(`Demo User ID: ${demoUserId}`);
    console.log(`Admin User ID: ${adminUserId}`);

    // 2. Clear existing demo data
    console.log("Clearing existing demo data...");
    
    const tablesToClear = ['ticket_messages', 'tickets', 'comments', 'qr_activity_logs', 'analytics_events'];
    for (const table of tablesToClear) {
      console.log(` - Deleting from ${table}`);
      const { error } = await supabaseAdmin.from(table).delete().neq('id', 0); // Deletes all rows
      if (error) throw new Error(`Error clearing ${table}: ${error.message}`);
    }

    // 3. Seed new data
    console.log("Seeding new data...");

    // Seed tickets
    console.log(" - Seeding tickets...");
    const { data: ticket, error: ticketError } = await supabaseAdmin.from('tickets').insert({
      user_id: demoUserId,
      subject: "My QR Code is not working",
      status: 'open',
      priority: 'high'
    }).select().single();
    if (ticketError) throw ticketError;
    
    // Seed ticket messages
    console.log(" - Seeding ticket messages...");
    const { error: msgError } = await supabaseAdmin.from('ticket_messages').insert({
      ticket_id: ticket.id,
      user_id: demoUserId,
      message: "I created a QR code but when I scan it, it goes to the wrong website."
    });
    if (msgError) throw msgError;

    // Seed comments
    console.log(" - Seeding comments...");
    const { data: comment, error: commentError } = await supabaseAdmin.from('comments').insert({
        user_id: demoUserId,
        page_id: 'home',
        content: "This platform is awesome!",
    }).select().single();
    if (commentError) throw commentError;

    const { error: replyError } = await supabaseAdmin.from('comments').insert({
        user_id: adminUserId,
        page_id: 'home',
        parent_id: comment.id,
        content: "Thanks for the feedback! We're glad you like it.",
    });
    if (replyError) throw replyError;

    // Seed QR activity
    console.log(" - Seeding QR activity logs...");
    const { error: qrError } = await supabaseAdmin.from('qr_activity_logs').insert({
        user_id: demoUserId,
        config: {
            value: "https://hostinger.com/tutorials",
            bgColor: "#ffffff",
            fgColor: "#000000",
            size: 256,
        }
    });
    if (qrError) throw qrError;

    // Seed analytics events
    console.log(" - Seeding analytics events...");
    const { error: analyticsError } = await supabaseAdmin.from('analytics_events').insert([
        { user_id: demoUserId, event_name: 'page_view', payload: { path: '/' } },
        { user_id: adminUserId, event_name: 'page_view', payload: { path: '/admin' } }
    ]);
    if (analyticsError) throw analyticsError;

    console.log("\n✅ Demo data refresh complete!");

  } catch (error) {
    console.error("\n❌ An error occurred during the refresh:", error.message);
    process.exit(1);
  }
};

main();
