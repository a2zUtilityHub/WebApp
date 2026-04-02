import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDefaultChatbotSettings } from '@/utils/chatbotErrorHandler';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

const AdminChatbotSettingsContent = ({ chatbotId }) => {
    const { fetchSettings, updateSettings, loading } = useChatbotAdmin(chatbotId);
    const [settings, setSettings] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!chatbotId) return;
            setIsInitializing(true);
            try {
                const data = await fetchSettings();
                
                // Always have data due to service defaults, but defensive coding:
                const safeData = data || getDefaultChatbotSettings(chatbotId);
                const custom = safeData.custom_settings || {};
                
                setSettings({
                    ...safeData,
                    bot_name: custom.bot_name || '',
                    bot_description: custom.bot_description || '',
                    greeting_message: custom.greeting_message || '',
                    fallback_message: custom.fallback_message || safeData.error_handling?.fallback_message || '',
                    enable_typing_indicator: custom.enable_typing_indicator ?? true,
                    enable_read_receipts: custom.enable_read_receipts ?? false
                });
            } catch (e) {
                console.error("Failed to load settings in component", e);
                setSettings(getDefaultChatbotSettings(chatbotId).custom_settings);
            } finally {
                setIsInitializing(false);
            }
        };
        load();
    }, [chatbotId, fetchSettings]);

    const handleSave = async () => {
        if (!chatbotId) return;
        setIsSaving(true);
        
        try {
            // Reconstruct the DB payload structure
            const { 
                id, chatbot_id, language, response_timeout, error_handling, 
                logging_enabled, security_settings, created_at, updated_at, 
                custom_settings,
                // UI fields
                bot_name, bot_description, greeting_message, fallback_message, 
                enable_typing_indicator, enable_read_receipts,
                ...rest 
            } = settings;

            const dbPayload = {
                language: language || 'en',
                response_timeout: response_timeout || 30,
                error_handling: {
                    ...(error_handling || {}),
                    fallback_message: fallback_message // Sync fallback message
                },
                logging_enabled: logging_enabled ?? true,
                security_settings: security_settings || {},
                custom_settings: {
                    ...(custom_settings || {}),
                    bot_name,
                    bot_description,
                    greeting_message,
                    fallback_message,
                    enable_typing_indicator,
                    enable_read_receipts
                }
            };

            await updateSettings(dbPayload);
        } catch (err) {
            console.error("Error saving settings:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (isInitializing) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 border rounded-lg bg-card/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading chatbot configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center sticky top-0 z-10 bg-background/95 backdrop-blur py-2 border-b mb-4">
                <h2 className="text-lg font-semibold">Bot Configuration</h2>
                <Button onClick={handleSave} disabled={isSaving || loading}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Identity</CardTitle>
                            <CardDescription>Configure the basic identity of your AI assistant.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Bot Name</Label>
                                <Input 
                                    value={settings.bot_name || ''} 
                                    onChange={e => handleChange('bot_name', e.target.value)} 
                                    placeholder="e.g. Support Bot"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea 
                                    value={settings.bot_description || ''} 
                                    onChange={e => handleChange('bot_description', e.target.value)} 
                                    placeholder="Internal description for admins"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Language Code</Label>
                                <Input 
                                    value={settings.language || 'en'} 
                                    onChange={e => handleChange('language', e.target.value)} 
                                    className="max-w-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card>
                        <CardHeader>
                            <CardTitle>Message Templates</CardTitle>
                            <CardDescription>Customize standard responses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Greeting Message</Label>
                                <Textarea 
                                    value={settings.greeting_message || ''} 
                                    onChange={e => handleChange('greeting_message', e.target.value)}
                                    placeholder="Hello! How can I help?"
                                />
                                <p className="text-xs text-muted-foreground">Sent automatically when a new conversation starts.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Fallback Message</Label>
                                <Input 
                                    value={settings.fallback_message || ''} 
                                    onChange={e => handleChange('fallback_message', e.target.value)}
                                    placeholder="I didn't understand that."
                                />
                                <p className="text-xs text-muted-foreground">Sent when the bot cannot match an intent.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="behavior">
                     <Card>
                        <CardHeader>
                            <CardTitle>Interaction Settings</CardTitle>
                            <CardDescription>Fine-tune how the bot interacts with users.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Typing Indicator</Label>
                                    <p className="text-sm text-muted-foreground">Show "Bot is typing..." before responding</p>
                                </div>
                                <Switch 
                                    checked={!!settings.enable_typing_indicator} 
                                    onCheckedChange={c => handleChange('enable_typing_indicator', c)} 
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Read Receipts</Label>
                                    <p className="text-sm text-muted-foreground">Show when users have read messages</p>
                                </div>
                                <Switch 
                                    checked={!!settings.enable_read_receipts} 
                                    onCheckedChange={c => handleChange('enable_read_receipts', c)} 
                                />
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label>Response Timeout (seconds)</Label>
                                <Input 
                                    type="number" 
                                    min="1" 
                                    max="120"
                                    value={settings.response_timeout || 30} 
                                    onChange={e => handleChange('response_timeout', parseInt(e.target.value) || 30)} 
                                    className="max-w-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

const AdminChatbotSettings = (props) => (
    <AdminErrorBoundary>
        <AdminChatbotSettingsContent {...props} />
    </AdminErrorBoundary>
);

export default AdminChatbotSettings;