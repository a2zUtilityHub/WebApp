import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlayCircle, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SEOAudit = () => {
    const { runSEOAudit, loading } = useAdminSEO();
    const [lastAudit, setLastAudit] = useState(null);

    const handleRunAudit = async () => {
        const result = await runSEOAudit();
        if (result) setLastAudit(result);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Site Audit</h2>
                    <p className="text-muted-foreground text-sm">Analyze your site health and performance.</p>
                </div>
                <Button onClick={handleRunAudit} disabled={loading} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlayCircle className="mr-2 h-4 w-4"/>}
                    Run New Audit
                </Button>
            </div>

            {lastAudit ? (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
                        <CardHeader><CardTitle>Health Score</CardTitle></CardHeader>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="relative h-32 w-32 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-100 dark:border-gray-800"></div>
                                <div className="text-4xl font-bold text-purple-600">{lastAudit.audit_score}</div>
                            </div>
                            <p className="mt-4 font-medium text-muted-foreground">Good Standing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Issues Found</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded bg-red-50 text-red-700 border border-red-100">
                                <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Errors</div>
                                <span className="font-bold">{lastAudit.issues_found}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded bg-yellow-50 text-yellow-700 border border-yellow-100">
                                <div className="flex items-center gap-2"><Info className="h-4 w-4"/> Warnings</div>
                                <span className="font-bold">{lastAudit.warnings_found}</span>
                            </div>
                             <div className="flex items-center justify-between p-3 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Passed Checks</div>
                                <span className="font-bold">24</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-dashed py-12 text-center bg-muted/20">
                    <div className="text-muted-foreground">No recent audit found. Run a new audit to see results.</div>
                </Card>
            )}
        </div>
    );
};

export default SEOAudit;