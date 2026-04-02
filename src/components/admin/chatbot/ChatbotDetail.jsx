import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatusBadge, TypeBadge } from './ChatbotBadges';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatbotAdmin } from '@/hooks/useChatbotAdmin';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Placeholder components for sub-tabs to save space
const PlaceholderTab = ({ name }) => (
    <div className="p-4 text-center text-muted-foreground border-dashed border-2 rounded-lg mt-4">
        {name} Management coming soon.
    </div>
);

const ChatbotDetail = ({ chatbot, open, onClose, onEdit }) => {
    const { fetchSettings, loading } = useChatbotAdmin(chatbot?.id);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        if (open && chatbot?.id) {
            const loadSettings = async () => {
                const data = await fetchSettings();
                if (data) {
                    setSettings({
                        ...data,
                        ...(data.custom_settings || {})
                    });
                } else {
                    // Default fallback for display
                    setSettings({
                        language: 'en',
                        response_timeout: 30,
                        bot_name: chatbot.name
                    });
                }
            };
            loadSettings();
        }
    }, [open, chatbot, fetchSettings]);

    if (!chatbot) return null;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-[800px] sm:max-w-[100vw] flex flex-col p-0 gap-0">
                <SheetHeader className="p-6 border-b bg-muted/10">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                             <div className="flex items-center gap-2 mb-2">
                                <StatusBadge status={chatbot.status} />
                                <TypeBadge type={chatbot.type} />
                            </div>
                            <SheetTitle className="text-2xl">{chatbot.name}</SheetTitle>
                            <p className="text-muted-foreground">{chatbot.description || 'No description'}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => { onEdit(chatbot); onClose(); }}>
                            <Edit className="h-4 w-4 mr-2"/> Edit
                        </Button>
                    </div>
                </SheetHeader>
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <Tabs defaultValue="overview">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                                <TabsTrigger value="training">Training</TabsTrigger>
                                <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="text-sm text-muted-foreground">Total Conversations</div>
                                        <div className="text-2xl font-bold">{chatbot.total_conversations}</div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="text-sm text-muted-foreground">Satisfaction</div>
                                        <div className="text-2xl font-bold">{chatbot.satisfaction_rating}</div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="conversations"><PlaceholderTab name="Conversations" /></TabsContent>
                            <TabsContent value="training"><PlaceholderTab name="Training Data" /></TabsContent>
                            <TabsContent value="kb"><PlaceholderTab name="Knowledge Base" /></TabsContent>
                            <TabsContent value="settings" className="mt-4">
                                {loading ? (
                                    <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                                ) : settings ? (
                                    <Card>
                                        <CardContent className="space-y-4 pt-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-muted-foreground">Bot Name</Label>
                                                    <div className="font-medium">{settings.bot_name || chatbot.name}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Language</Label>
                                                    <div className="font-medium">{settings.language}</div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Response Timeout</Label>
                                                    <div className="font-medium">{settings.response_timeout}s</div>
                                                </div>
                                                <div>
                                                    <Label className="text-muted-foreground">Typing Indicator</Label>
                                                    <div className="font-medium">{settings.enable_typing_indicator ? 'Enabled' : 'Disabled'}</div>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Label className="text-muted-foreground">Greeting Message</Label>
                                                <div className="p-3 bg-muted rounded-md mt-1 text-sm">
                                                    {settings.greeting_message || 'No greeting configured'}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="text-center p-4 text-muted-foreground">No settings available</div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ChatbotDetail;