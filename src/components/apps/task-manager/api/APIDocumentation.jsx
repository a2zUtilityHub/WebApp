
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Key, BookOpen, Webhook, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export const APIDocumentation = () => {
  const { toast } = useToast();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "Code snippet copied successfully." });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Terminal className="w-8 h-8 text-teal-600" />
          API Documentation
        </h1>
        <p className="text-muted-foreground mt-2">Integrate Task Manager Pro programmatically into your own applications using our REST API.</p>
      </div>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="endpoints"><BookOpen className="w-4 h-4 mr-2"/> Endpoints</TabsTrigger>
          <TabsTrigger value="auth"><Key className="w-4 h-4 mr-2"/> Auth</TabsTrigger>
          <TabsTrigger value="examples"><Code className="w-4 h-4 mr-2"/> Examples</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="w-4 h-4 mr-2"/> Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-mono text-sm">GET</Badge>
                <CardTitle className="font-mono text-lg">/api/v1/projects</CardTitle>
              </div>
              <CardDescription>Retrieve a list of all accessible projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Parameters</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 mb-4">
                <li><code>limit</code> (optional) - Number of results to return. Default 50.</li>
                <li><code>offset</code> (optional) - Pagination offset.</li>
              </ul>
              <h4 className="font-semibold mb-2">Response</h4>
              <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
{`{
  "data": [
    {
      "id": "prj_123abc",
      "name": "Website Redesign",
      "status": "active"
    }
  ],
  "meta": { "total": 1 }
}`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-mono text-sm">POST</Badge>
                <CardTitle className="font-mono text-lg">/api/v1/tasks</CardTitle>
              </div>
              <CardDescription>Create a new task within a project.</CardDescription>
            </CardHeader>
            <CardContent>
               <h4 className="font-semibold mb-2">Request Body</h4>
               <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
{`{
  "project_id": "prj_123abc",
  "title": "Update landing page copy",
  "priority": "high",
  "status": "todo"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Learn how to authenticate your API requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Task Manager Pro API uses Bearer token authentication via JWT (JSON Web Tokens).</p>
              <p>You must include your API key or a valid user session token in the <code>Authorization</code> header of every request.</p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm text-foreground flex justify-between items-center">
                <span>Authorization: Bearer YOUR_API_KEY_OR_TOKEN</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY_OR_TOKEN')}>Copy</Button>
              </div>
              <Button onClick={() => toast({title: "🚧 Generating Token...", description: "This feature is not yet fully implemented."})}>Generate New API Key</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
           <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Quick snippets to get you started.</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">cURL</h4>
              <div className="relative group mb-6">
                <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto text-foreground">
{`curl -X GET "https://api.taskmanager.pro/v1/projects" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
                </pre>
                <Button size="sm" variant="secondary" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard('curl command...')}>Copy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
           <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Listen for real-time events in your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Webhooks allow your system to receive HTTP POST payloads when specific events occur within Task Manager Pro.</p>
              <Button onClick={() => toast({title: "🚧 Webhook Builder", description: "Webhook creation modal will be available soon."})}>Add Webhook Endpoint</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
