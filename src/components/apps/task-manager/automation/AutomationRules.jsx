
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGoogleTagManager } from '@/hooks/useGoogleTagManager';

export const AutomationRules = () => {
  const { toast } = useToast();
  const { pushEvent } = useGoogleTagManager();
  
  const handleToggle = (ruleName) => {
    pushEvent('automation_rule_toggled', { rule_name: ruleName });
    toast({ title: "Rule Updated", description: `Automation rule '${ruleName}' status changed.` });
  };

  const handleCreateRule = () => {
    pushEvent('automation_rule_created', { method: 'button_click' });
    toast({title: "🚧 Rule Builder", description: "The visual rule builder is under construction."});
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Zap className="w-8 h-8 text-teal-600" />
            Automation Rules
          </h1>
          <p className="text-muted-foreground mt-2">Create triggers and actions to automate repetitive tasks.</p>
        </div>
        <Button onClick={handleCreateRule}>
          <Plus className="w-4 h-4 mr-2" /> Create Rule
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Auto-assign Bugs</CardTitle>
              <CardDescription>Automatically assign tasks tagged with "Bug" to the QA team.</CardDescription>
            </div>
            <Switch defaultChecked onCheckedChange={() => handleToggle('Auto-assign Bugs')} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <span className="font-semibold text-foreground">WHEN</span> Tag added is 'Bug'
              <ArrowRight className="w-4 h-4" />
              <span className="font-semibold text-foreground">THEN</span> Assign to 'QA Team'
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Stale Task Warning</CardTitle>
              <CardDescription>Notify assignee if a task stays "In Progress" for over 5 days.</CardDescription>
            </div>
            <Switch defaultChecked onCheckedChange={() => handleToggle('Stale Task Warning')} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <span className="font-semibold text-foreground">WHEN</span> Status is 'In Progress' for 5 days
              <ArrowRight className="w-4 h-4" />
              <span className="font-semibold text-foreground">THEN</span> Send Slack Notification
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
