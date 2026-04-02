
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Book, HelpCircle, Lightbulb, Keyboard, Info, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { q: "What is a Kanban board?", a: "A Kanban board is a visual way to manage tasks. It uses columns (like To-do, In Progress, Done) to represent the stages of your workflow." },
    { q: "How do I move tasks?", a: "Simply click and hold a task card, then drag it to the desired column and release. The task's status will update automatically." },
    { q: "Are there keyboard shortcuts?", a: "Yes! Use Ctrl/Cmd+N for a new task, Enter to save, Escape to close modals, and Ctrl/Cmd+F to search." },
    { q: "Is my data backed up?", a: "Yes, your tasks are automatically synced and securely backed up to our database in real-time." },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-4xl py-12 animate-fade-in">
      <Helmet>
        <title>Help & Documentation - A2Z Utility Hub</title>
      </Helmet>
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our guides, tutorials, and frequently asked questions to get the most out of Task Manager.
        </p>
        
        <div className="relative max-w-xl mx-auto mt-8 text-left">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for answers..." 
            className="pl-10 py-6 text-lg rounded-xl shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <Book className="w-6 h-6 text-primary mb-2" />
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Master the basics in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p><strong className="text-foreground">1. Create a task:</strong> Click the "New Task" button or press Ctrl+N.</p>
            <p><strong className="text-foreground">2. Organize:</strong> Drag and drop tasks between To-Do, In Progress, and Done.</p>
            <p><strong className="text-foreground">3. Details:</strong> Click any task to edit description, priority, and due dates.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Keyboard className="w-6 h-6 text-primary mb-2" />
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>Work faster with hotkeys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between border-b pb-1"><span>New Task</span> <kbd className="bg-muted px-1 rounded text-xs font-mono">⌘ N</kbd></div>
              <div className="flex justify-between border-b pb-1"><span>Search</span> <kbd className="bg-muted px-1 rounded text-xs font-mono">⌘ F</kbd></div>
              <div className="flex justify-between border-b pb-1"><span>Save</span> <kbd className="bg-muted px-1 rounded text-xs font-mono">Enter</kbd></div>
              <div className="flex justify-between border-b pb-1"><span>Close</span> <kbd className="bg-muted px-1 rounded text-xs font-mono">Esc</kbd></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center"><Lightbulb className="w-6 h-6 mr-2 text-amber-500" /> Frequently Asked Questions</h2>
      {filteredFaqs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full bg-card rounded-xl border shadow-sm px-4">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <Info className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No results found for "{searchQuery}". Try a different term.</p>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
