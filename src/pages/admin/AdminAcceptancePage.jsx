import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const StatusIcon = ({ status }) => {
  if (status === 'passing') return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (status === 'failing') return <XCircle className="h-5 w-5 text-red-500" />;
  if (status === 'running') return <Loader2 className="h-5 w-5 animate-spin" />;
  return null;
};

const AdminAcceptancePage = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [testResults, setTestResults] = useState({});
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const runTest = useCallback(async (name, testFn) => {
    setTestResults(prev => ({ ...prev, [name]: { status: 'running' } }));
    try {
      const result = await testFn();
      if (result.success) {
        setTestResults(prev => ({ ...prev, [name]: { status: 'passing', message: result.message } }));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [name]: { status: 'failing', message: error.message } }));
    }
  }, []);

  const acceptanceTests = [
    { name: 'Admin Login', description: 'Checks if current user is an authenticated admin.', testFn: async () => {
      const isAdmin = ['Super Admin', 'Admin'].includes(profile?.roles?.name);
      return { success: isAdmin, message: isAdmin ? `Logged in as ${profile.roles.name}` : 'Current user is not an admin.' };
    }},
    { name: 'Profile Menu Visibility', description: 'Checks if the user object exists, which controls menu visibility.', testFn: async () => {
      return { success: !!user, message: user ? 'User is authenticated.' : 'User is not authenticated.' };
    }},
    { name: 'Donation Page Reachable', description: 'Verifies the donation page is configured and accessible.', testFn: async () => {
      const nav = document.querySelector('nav a[href="/donate"]');
      const footer = document.querySelector('footer a[href="/donate"]');
      const success = !!nav && !!footer;
      return { success, message: success ? 'Links found in nav and footer.' : 'Missing link in nav or footer.' };
    }},
    { name: 'Notification Bell Count', description: 'Checks if notification count matches context.', testFn: async () => {
        const count = notifications.filter(n => !n.is_read).length;
        const success = count === unreadCount;
        return { success, message: success ? `Count matches: ${count}` : `Count mismatch: context=${unreadCount}, actual=${count}` };
    }},
    { name: 'Send Notification', description: 'Sends a test notification to the current user.', testFn: async () => {
      const { error } = await supabase.from('notifications').insert({ user_id: user.id, type: 'test', data: { message: 'This is a test notification.' }});
      return { success: !error, message: error ? error.message : 'Test notification sent successfully.' };
    }},
    { name: 'QR Generation Quota Check', description: 'Fetches QR app settings to check freemium config.', testFn: async () => {
      const { data, error } = await supabase.from('app_settings').select('freemium_enabled, freemium_quota').eq('app_id', 1).single(); // Assuming QR app is id 1
      const success = !error && data && data.freemium_enabled;
      return { success, message: success ? `Freemium enabled with quota ${data.freemium_quota}.` : (error?.message || 'Could not verify quota.') };
    }},
    { name: 'Create Comment', description: 'Attempts to post and delete a test comment.', testFn: async () => {
      const { data, error } = await supabase.from('comments').insert({ user_id: user.id, page_id: 'test-page', content: 'Acceptance test comment.' }).select().single();
      if (error) return { success: false, message: `Insert failed: ${error.message}` };
      const { error: deleteError } = await supabase.from('comments').delete().eq('id', data.id);
      return { success: !deleteError, message: deleteError ? `Delete failed: ${deleteError.message}`: 'Comment created and cleaned up.' };
    }},
    { name: 'Create Support Ticket', description: 'Attempts to create and delete a test support ticket.', testFn: async () => {
        const { data, error } = await supabase.from('tickets').insert({ user_id: user.id, subject: 'Acceptance Test Ticket', status: 'open' }).select().single();
        if (error) return { success: false, message: `Insert failed: ${error.message}` };
        const { error: deleteError } = await supabase.from('tickets').delete().eq('id', data.id);
        return { success: !deleteError, message: deleteError ? `Delete failed: ${deleteError.message}`: 'Ticket created and cleaned up.' };
    }},
  ];

  const runAllTests = useCallback(async () => {
    setIsTestRunning(true);
    setLastRun(new Date());
    for (const test of acceptanceTests) {
      await runTest(test.name, test.testFn);
    }
    setIsTestRunning(false);
    toast({ title: "Acceptance tests completed!" });
  }, [acceptanceTests, runTest, toast]);

  useEffect(() => {
    runAllTests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Acceptance Tests - Admin</title>
      </Helmet>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Acceptance Tests</h1>
            <p className="text-muted-foreground">Live status checks for core application features.</p>
             {lastRun && <p className="text-sm text-muted-foreground mt-1">Last run: {lastRun.toLocaleString()}</p>}
          </div>
          <Button onClick={runAllTests} disabled={isTestRunning}>
            {isTestRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Run All Tests
          </Button>
        </div>

        <div className="space-y-4">
          {acceptanceTests.map((test) => (
            <Card key={test.name}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={testResults[test.name]?.status} />
                    <span className="font-mono text-sm capitalize">{testResults[test.name]?.status || 'Pending'}</span>
                  </div>
                </div>
              </CardHeader>
              {testResults[test.name]?.status === 'failing' && (
                <CardContent>
                  <pre className="bg-destructive/10 text-destructive-foreground p-3 rounded-md text-xs overflow-x-auto">
                    {testResults[test.name]?.message}
                  </pre>
                </CardContent>
              )}
               {testResults[test.name]?.status === 'passing' && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{testResults[test.name]?.message}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminAcceptancePage;