import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LayoutDashboard, MessageSquare, Settings, Activity, FileText, Zap, Loader2 } from 'lucide-react';
import AdminChatbotAnalytics from '@/components/admin/chatbot/AdminChatbotAnalytics';
import AdminChatbotIntents from '@/components/admin/chatbot/AdminChatbotIntents';
import AdminChatbotResponses from '@/components/admin/chatbot/AdminChatbotResponses';
import AdminChatbotConversations from '@/components/admin/chatbot/AdminChatbotConversations';
import AdminChatbotSettings from '@/components/admin/chatbot/AdminChatbotSettings';
import { useChatbotManagement } from '@/hooks/useChatbotManagement';
import { chatbotSettingsService } from '@/services/chatbotSettingsService';

const AdminChatbotPage = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const { getChatbots } = useChatbotManagement();
    const [chatbotId, setChatbotId] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // Initial load of chatbots
    useEffect(() => {
        const init = async () => {
            setInitializing(true);
            try {
                const { data } = await getChatbots();
                if (data && data.length > 0) {
                    const id = data[0].id;
                    setChatbotId(id);
                    // Ensure settings exist for the active bot immediately
                    await chatbotSettingsService.ensureSettingsExist(id);
                }
            } catch (error) {
                console.error("Failed to initialize chatbot admin:", error);
            } finally {
                setInitializing(false);
            }
        };
        init();
    }, [getChatbots]);

    if (initializing) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
        );
    }

    if (!chatbotId) {
         return (
             <div className="p-8 text-center">
                 <h2 className="text-xl font-bold">No Chatbots Found</h2>
                 <p className="text-muted-foreground mt-2">Please create a chatbot to manage it.</p>
             </div>
         );
    }

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            <Helmet><title>Chatbot Management | Admin</title></Helmet>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-6 rounded-2xl shadow-sm border backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Chatbot Manager</h1>
                    <p className="text-muted-foreground mt-1">Configure your AI assistant's intelligence and behavior.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/20">
                    <TabsTrigger value="analytics" className="gap-2 py-2"><Activity className="h-4 w-4"/> Analytics</TabsTrigger>
                    <TabsTrigger value="intents" className="gap-2 py-2"><Zap className="h-4 w-4"/> Intents</TabsTrigger>
                    <TabsTrigger value="responses" className="gap-2 py-2"><FileText className="h-4 w-4"/> Responses</TabsTrigger>
                    <TabsTrigger value="conversations" className="gap-2 py-2"><MessageSquare className="h-4 w-4"/> Conversations</TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 py-2"><Settings className="h-4 w-4"/> Settings</TabsTrigger>
                </TabsList>

                <div className="mt-6 min-h-[400px]">
                    <TabsContent value="analytics"><AdminChatbotAnalytics chatbotId={chatbotId} /></TabsContent>
                    <TabsContent value="intents"><AdminChatbotIntents chatbotId={chatbotId} /></TabsContent>
                    <TabsContent value="responses"><AdminChatbotResponses chatbotId={chatbotId} /></TabsContent>
                    <TabsContent value="conversations"><AdminChatbotConversations chatbotId={chatbotId} /></TabsContent>
                    <TabsContent value="settings"><AdminChatbotSettings chatbotId={chatbotId} /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default AdminChatbotPage;