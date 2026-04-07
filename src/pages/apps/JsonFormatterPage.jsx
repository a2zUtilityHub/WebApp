import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Copy, Download, AlertCircle, Loader2, CheckCircle2, FileJson, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';

const jsonData = {
  about: {
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data online. Free JSON beautifier and validator running entirely in your browser.",
    features: [
      { icon: <FileJson className="w-6 h-6" />, title: "Instant Formatting", desc: "Beautify messy JSON into readable, indented text." },
      { icon: <CheckCircle2 className="w-6 h-6" />, title: "Validation", desc: "Catch syntax errors instantly before they break your app." },
      { icon: <Zap className="w-6 h-6" />, title: "Minification", desc: "Compress your JSON to save space and bandwidth." },
    ],
    benefits: [
      "Debug API responses faster with clear formatting.",
      "Ensure JSON validity before saving or sending data.",
      "Completely local processing for maximum privacy.",
      "Easy copy/paste or direct file downloads."
    ]
  },
  manual: {
    title: "JSON Formatter",
    steps: [
      { title: "Paste JSON", desc: "Paste your raw JSON string into the Input text area." },
      { title: "Format", desc: "Click the 'Format' button to beautify and validate." },
      { title: "Minify", desc: "Click 'Minify' to remove all whitespace." },
      { title: "Copy/Download", desc: "Use the actions below the output to grab your result." }
    ],
    tips: [
      "If you get an error, check for trailing commas or missing quotes.",
      "Minification is great for production data payloads.",
      "Formatting uses standard 2-space indentation."
    ]
  },
  faq: [
    { q: "Is my JSON data sent to a server?", a: "No. All formatting and validation happens strictly in your browser. Your data remains private." },
    { q: "What happens if my JSON is invalid?", a: "The tool will display a detailed error message indicating what is wrong with the syntax." },
    { q: "Is there a limit to the JSON size?", a: "Only limited by your browser's memory, though extremely large files may cause browser lag." }
  ]
};

const JsonFormatterPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const copyOutput = async () => {
    if (!output) {
      toast({ title: 'Nothing to copy', variant: 'destructive' });
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied!', description: 'JSON copied to clipboard.' });
    } catch (err) {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const downloadJson = () => {
    if (!output) {
      toast({ title: 'Nothing to download', variant: 'destructive' });
      return;
    }
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...jsonData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...jsonData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={jsonData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="json-formatter" /> }
  ];

  return (
    <>
      <Helmet>
        <title>JSON Formatter - A2Z Utility Hub</title>
        <meta name="description" content="Format, validate, and minify JSON data online. Free JSON beautifier and validator." />
      </Helmet>
      <div className="full-width-container py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-primary/10 rounded-2xl">
              <Code className="w-10 h-10 text-brand-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">JSON Formatter & Validator</h1>
          <p className="mt-2 text-lg text-muted-foreground">Beautify, minify, and validate your JSON data instantly.</p>
        </div>

        {authLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !isAuthenticated ? (
          <div className="min-h-[40vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
              <CardHeader className="pb-6 pt-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                  <Code className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">JSON Formatter</CardTitle>
                <CardDescription className="text-base mt-3 text-muted-foreground">
                  Please log in to access the JSON Formatter tool.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 px-8">
                <Button size="lg" className="w-full text-md font-semibold h-12" onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}>
                  Login to Continue
                </Button>
                <Button variant="outline" size="lg" className="w-full h-12 border-primary/20 hover:bg-primary/5" onClick={() => { setAuthView('signup'); setIsAuthModalOpen(true); }}>
                  Create an Account
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Input JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{"name": "John", "age": 30}'
                  className="font-mono min-h-[400px] text-gray-900"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={formatJson} className="flex-1">
                    <Code className="mr-2 h-4 w-4" /> Format
                  </Button>
                  <Button onClick={minifyJson} variant="outline" className="flex-1">
                    Minify
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Output JSON</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="font-mono min-h-[400px] bg-muted text-gray-900"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={copyOutput} variant="outline" className="flex-1">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button onClick={downloadJson} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <AppTabsLayout tabsConfig={tabsConfig} />

      </div>
      <AppLoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView={authView} />
    </>
  );
};

export default JsonFormatterPage;