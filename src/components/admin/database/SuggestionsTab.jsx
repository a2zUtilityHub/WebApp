
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SuggestionsTab = () => {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Action triggered",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const suggestions = [
    {
      id: 1,
      title: 'Missing Index on audit_logs.user_id',
      description: 'Queries filtering by user_id on audit_logs are taking longer. Adding an index will improve query performance.',
      impact: 'High',
      icon: Zap,
      color: 'text-amber-500'
    },
    {
      id: 2,
      title: 'Unused Table: old_analytics_data',
      description: 'This table hasn\'t been queried in 90 days. Consider archiving or dropping it to save space.',
      impact: 'Low',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      id: 3,
      title: 'Missing RLS on temporary_records',
      description: 'The table "temporary_records" does not have Row Level Security enabled. Fix immediately.',
      impact: 'High',
      icon: AlertTriangle,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Optimization Suggestions</h2>
          <p className="text-muted-foreground">Automated recommendations to improve database health.</p>
        </div>
        <Button onClick={handleAction}>
          <Lightbulb className="w-4 h-4 mr-2" /> Run Analysis
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-muted ${suggestion.color}`}>
                  <suggestion.icon className="w-5 h-5" />
                </div>
                <Badge variant={suggestion.impact === 'High' ? 'destructive' : suggestion.impact === 'Medium' ? 'default' : 'secondary'}>
                  {suggestion.impact} Impact
                </Badge>
              </div>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="w-full" onClick={handleAction}>View Details</Button>
              <Button className="w-full" onClick={handleAction}>Apply Fix</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsTab;
