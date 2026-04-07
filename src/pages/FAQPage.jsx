import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useFAQ } from '@/hooks/useFAQ';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const FAQPage = () => {
    const { fetchFAQItems } = useFAQ();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            const { data } = await fetchFAQItems({ status: 'active', limit: 100 });
            if (data) {
                setItems(data);
                setFilteredItems(data);
            }
            setLoading(false);
        };
        load();
    }, [fetchFAQItems]);

    useEffect(() => {
        if (!search) {
            setFilteredItems(items);
        } else {
            const lowerSearch = search.toLowerCase();
            setFilteredItems(items.filter(i => 
                i.question.toLowerCase().includes(lowerSearch) || 
                i.answer.toLowerCase().includes(lowerSearch)
            ));
        }
    }, [search, items]);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Frequently Asked Questions | a2z Utility Hub</title>
                <meta name="description" content="Find answers to common questions about a2z Utility Hub services, accounts, billing, and technical support." />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJMK1M1R4H"></script>
                <script>
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-CJMK1M1R4H');
                  `}
                </script>
            </Helmet>

            <div className="bg-primary/5 py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input 
                            className="pl-10 h-12 text-lg bg-background shadow-sm" 
                            placeholder="Search for answers..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container py-12 max-w-3xl mx-auto">
                {loading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No FAQs found matching your query.</div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <AccordionItem value={item.id} className="border rounded-lg px-4 bg-card shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-4 text-left font-medium text-lg">
                                        <div className="flex items-center gap-3">
                                            <span>{item.question}</span>
                                            <Badge variant="secondary" className="text-xs font-normal ml-auto shrink-0">{item.category}</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-4 prose dark:prose-invert max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    );
};

export default FAQPage;