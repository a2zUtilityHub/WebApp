import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('question, answer')
        .eq('is_deleted', false)
        .eq('language', i18n.language);
      
      if (error) {
        toast({ title: "Error fetching FAQs", description: error.message, variant: "destructive" });
      } else {
        setFaqs(data);
      }
      setLoading(false);
    };

    fetchFaqs();
  }, [toast, i18n.language]);
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>FAQ - A2Z Utility Hub</title>
        <meta name="description" content="Find answers to frequently asked questions about A2Z Utility Hub." />
      </Helmet>
      
      <div className="w-full bg-[#F9FAFB] border-b border-gray-200 py-16 px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="content-container text-left">
          <h1 className="text-[#1F2937]">Frequently Asked Questions</h1>
          <p className="mt-3 text-lg text-[#4B5563] max-w-2xl">Have questions? We've got answers.</p>
        </div>
      </div>

      <div className="full-width-section bg-white">
        <div className="content-container max-w-4xl ml-0 lg:mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
          ) : faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full bg-white rounded-xl border border-gray-200 px-6 py-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0 border-gray-100">
                  <AccordionTrigger className="text-lg text-left text-gray-900 font-semibold py-4 hover:no-underline hover:text-brand-primary transition-colors">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-left py-16 px-8 bg-gray-50 rounded-xl border border-gray-200">
               <h2 className="text-2xl font-semibold text-gray-900">No FAQs found</h2>
               <p className="text-gray-500 mt-2">There are no FAQs available in this language yet. Please check back later.</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FaqPage;