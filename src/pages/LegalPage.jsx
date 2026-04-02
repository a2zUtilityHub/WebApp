import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, History } from 'lucide-react';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LegalPage = () => {
  const { page } = useParams();
  const { toast } = useToast();
  const [document, setDocument] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const docTypeMap = {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    cookies: 'Cookie Policy',
    disclaimer: 'Disclaimer',
  };

  const title = docTypeMap[page];

  useEffect(() => {
    if (!title) {
      setLoading(false);
      return;
    }

    const fetchLegalDoc = async () => {
      setLoading(true);
      try {
        const { data: latestDoc, error: latestError } = await supabase
          .from('legal_documents')
          .select('*')
          .eq('doc_type', page)
          .not('published_at', 'is', null)
          .order('version', { ascending: false })
          .limit(1)
          .single();

        if (latestError && latestError.code !== 'PGRST116') throw latestError;
        
        setDocument(latestDoc);

        if (latestDoc) {
          const { data: historyDocs, error: historyError } = await supabase
            .from('legal_documents')
            .select('*')
            .eq('doc_type', page)
            .not('published_at', 'is', null)
            .order('version', { ascending: false });
          
          if (historyError) throw historyError;
          setHistory(historyDocs);
        }

      } catch (error) {
        toast({ title: 'Error fetching document', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchLegalDoc();
  }, [page, title, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!title) {
    return <Navigate to="/" replace />;
  }

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">Document Not Found</h1>
        <p className="text-muted-foreground mt-4">The {title} has not been published yet.</p>
        <Link to="/" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md">Go Home</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} - A2Z Utility Hub</title>
        <meta name="description" content={`Read the ${title} for A2Z Utility Hub.`} />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Version {document.version} | Last updated: {format(new Date(document.published_at), 'MMMM d, yyyy')}
            </p>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: document.content }} />
          <CardFooter>
            {history.length > 1 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="history">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Version History
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {history.map(doc => (
                        <li key={doc.id} className="text-sm text-muted-foreground">
                          <strong>Version {doc.version}</strong> - Published on {format(new Date(doc.published_at), 'MMMM d, yyyy')}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LegalPage;