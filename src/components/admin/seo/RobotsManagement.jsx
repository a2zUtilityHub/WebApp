import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAdminSEO } from '@/hooks/useAdminSEO';
import { Loader2, Save, CheckCheck, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RobotsManagement = () => {
    const { fetchRobotsTxt, updateRobotsTxt, loading } = useAdminSEO();
    const [content, setContent] = useState('');
    const [validationStatus, setValidationStatus] = useState(null); // 'success', 'error'

    useEffect(() => {
        const load = async () => {
            const txt = await fetchRobotsTxt();
            setContent(txt);
        };
        load();
    }, []);

    const handleSave = async () => {
        await updateRobotsTxt(content);
    };

    const handleValidate = () => {
        // Simple mock validation
        if (content.includes('User-agent:') && (content.includes('Allow:') || content.includes('Disallow:'))) {
            setValidationStatus('success');
        } else {
            setValidationStatus('error');
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Robots.txt Editor</CardTitle>
                    <CardDescription>Configure which parts of your site should be indexed by crawlers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {validationStatus === 'success' && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                            <CheckCheck className="h-4 w-4" />
                            <AlertTitle>Valid Syntax</AlertTitle>
                            <AlertDescription>Your robots.txt file appears to be correctly formatted.</AlertDescription>
                        </Alert>
                    )}
                    {validationStatus === 'error' && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Invalid Syntax</AlertTitle>
                            <AlertDescription>Missing User-agent or Allow/Disallow directives.</AlertDescription>
                        </Alert>
                    )}
                    
                    <Textarea 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                        className="font-mono min-h-[300px] resize-y"
                        placeholder="User-agent: *"
                    />
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleValidate}>Validate Syntax</Button>
                        <Button variant="outline" onClick={() => window.open('/robots.txt', '_blank')}>Preview</Button>
                    </div>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RobotsManagement;