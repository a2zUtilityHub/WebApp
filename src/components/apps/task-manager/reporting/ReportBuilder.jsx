
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, PieChart, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const ReportBuilder = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({ title: "Exporting Report", description: "Your PDF is being generated. This might take a moment." });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-teal-600" />
            Advanced Reporting
          </h1>
          <p className="text-muted-foreground mt-2">Analyze team productivity, velocity, and project burndown.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export to PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-teal-600"/> Sprint Velocity</CardTitle>
            <CardDescription>Story points completed per week</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-border/50 bg-slate-50 dark:bg-slate-900/50 m-4 rounded-xl border-dashed">
            <p className="text-muted-foreground text-sm">Chart visualization will render here.</p>
          </CardContent>
        </Card>

        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="w-5 h-5 text-teal-600"/> Task Distribution</CardTitle>
            <CardDescription>Tasks by assignee and priority</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-border/50 bg-slate-50 dark:bg-slate-900/50 m-4 rounded-xl border-dashed">
            <p className="text-muted-foreground text-sm">Chart visualization will render here.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
         <Button onClick={() => toast({title: "🚧 Custom Builder", description: "Custom metric selection is coming in Phase 4."})}>Build Custom Report</Button>
      </div>
    </div>
  );
};
