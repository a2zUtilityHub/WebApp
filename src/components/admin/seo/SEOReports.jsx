import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Download, Calendar } from 'lucide-react';
import { useAdminSEO } from '@/hooks/useAdminSEO';

const SEOReports = () => {
    const { generateSEOReport, loading } = useAdminSEO();
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Performance Reports</h2>
                <Button onClick={() => generateSEOReport({})} disabled={loading}>
                    <FileText className="mr-2 h-4 w-4"/> Generate New Report
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {[1,2].map(i => (
                    <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-start">
                                <span className="text-base">Monthly SEO Report</span>
                                <FileText className="h-5 w-5 text-blue-500" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> May 1 - May 31, 2025
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="w-full"><Download className="mr-2 h-3 w-3"/> PDF</Button>
                                <Button size="sm" variant="outline" className="w-full"><Download className="mr-2 h-3 w-3"/> CSV</Button>
                            </div>
                        </CardContent>
                    </Card>
                 ))}
            </div>
        </div>
    );
};

export default SEOReports;