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

            <div className="bg-background py-20 relative overflow-hidden border-b border-border/50">
                {/* Soft Glowing Background Orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
                
                <div className="container text-center relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-foreground">How can we help?</h1>
                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">Search our knowledge base or browse the categories below to find answers to your questions.</p>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                        <Input 
                            className="pl-14 h-16 text-lg bg-background/60 backdrop-blur-xl border border-border/50 rounded-full shadow-lg focus-visible:ring-4 focus-visible:ring-primary/10 hover:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground/60" 
                            placeholder="Search for answers (e.g. 'billing', 'account')..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container py-16 max-w-4xl mx-auto relative">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary"/></div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-24 bg-background/60 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-sm">
                        <div className="mx-auto w-20 h-20 bg-muted/50 border border-border/50 rounded-full flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-foreground mb-2">No answers found</h3>
                        <p className="text-muted-foreground text-lg">We couldn't find any FAQs matching "{search}". Try a different term.</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-5">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <AccordionItem value={item.id} className="border border-border/50 rounded-2xl px-6 bg-background/60 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow overflow-hidden group data-[state=open]:bg-background/80">
                                    <AccordionTrigger className="hover:no-underline py-5 text-left font-bold text-lg text-foreground hover:text-primary transition-colors">
                                        <div className="flex items-center gap-4 w-full pr-4">
                                            <span className="flex-1">{item.question}</span>
                                            <Badge variant="secondary" className="text-[12px] font-semibold bg-muted text-muted-foreground group-data-[state=open]:bg-primary/10 group-data-[state=open]:text-primary transition-colors shrink-0 rounded-full px-3 py-1 border-0">{item.category}</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground/90 text-[15px] leading-relaxed pb-6 pt-2 prose dark:prose-invert max-w-none prose-p:last:mb-0">
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