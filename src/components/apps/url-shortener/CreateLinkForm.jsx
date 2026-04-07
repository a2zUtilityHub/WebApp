import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Link, Loader2, Settings, Lock, CalendarOff, ArrowRight, 
  CheckCircle2, XCircle, AlertCircle, QrCode, Copy, RefreshCw, BarChart2 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LinkPreviewCard from './LinkPreviewCard';
import ShareButtons from './ShareButtons';
import QRCodeModal from './QRCodeModal';
import { isBefore, startOfToday } from 'date-fns';

const CreateLinkForm = ({ settings, onLinkCreated, linkCount }) => {
  const { toast } = useToast();
  
  // Form State
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  // Validation State
  const [urlStatus, setUrlStatus] = useState('idle'); // idle, valid, invalid
  const [aliasStatus, setAliasStatus] = useState('idle'); // idle, checking, available, taken
  const [passwordStrength, setPasswordStrength] = useState(''); // weak, medium, strong
  const [dateError, setDateError] = useState('');
  
  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Debounce helper for alias checking
  useEffect(() => {
    if (!customSlug) {
      setAliasStatus('idle');
      return;
    }
    
    setAliasStatus('checking');
    const timer = setTimeout(async () => {
      if (customSlug.length < 3) {
        setAliasStatus('invalid');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('url_shortener')
          .select('id')
          .eq('custom_slug', customSlug)
          .maybeSingle();
          
        if (data) {
          setAliasStatus('taken');
        } else {
          setAliasStatus('available');
        }
      } catch (e) {
        setAliasStatus('idle');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [customSlug]);

  // URL Validation
  useEffect(() => {
    if (!longUrl) {
      setUrlStatus('idle');
      return;
    }
    
    try {
      const urlToTest = /^https?:\/\//i.test(longUrl) ? longUrl : `https://${longUrl}`;
      new URL(urlToTest);
      setUrlStatus('valid');
    } catch {
      setUrlStatus('invalid');
    }
  }, [longUrl]);

  // Password Strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    if (password.length < 6) setPasswordStrength('weak');
    else if (password.length < 10 || !/\d/.test(password)) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  // Date validation
  useEffect(() => {
    if (!expiresAt) {
      setDateError('');
      return;
    }
    const selectedDate = new Date(expiresAt);
    if (isBefore(selectedDate, new Date())) {
      setDateError('Expiration time cannot be in the past');
    } else {
      setDateError('');
    }
  }, [expiresAt]);


  const getShortUrl = (link) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${link.custom_slug || link.short_code}`;
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (urlStatus === 'invalid' || !longUrl) {
      toast({ title: "Please enter a valid URL.", variant: "destructive" });
      return;
    }
    if (aliasStatus === 'taken' || aliasStatus === 'invalid') {
      toast({ title: "Please fix custom alias errors.", variant: "destructive" });
      return;
    }
    if (dateError) {
      toast({ title: "Please fix expiration date errors.", variant: "destructive" });
      return;
    }

    if (settings?.freemium_enabled && linkCount >= settings.freemium_quota) {
      toast({ title: "Link Limit Reached", description: "Please upgrade to create more links.", variant: "destructive" });
      trackEvent('url_limit_reached');
      return;
    }

    let formattedUrl = longUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      
      const shortCode = customSlug || Math.random().toString(36).substring(2, 8);
      
      const payload = {
        original_url: formattedUrl,
        short_code: shortCode,
        custom_slug: customSlug || null,
        password: password || null,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        user_id: userId,
        is_deleted: false,
        visit_count: 0
      };

      const { data, error } = await supabase
        .from('url_shortener')
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('This custom alias is already taken. Please choose another.');
        }
        throw error;
      }

      const newLink = data;
      
      onLinkCreated(newLink);
      setSuccessData(newLink);
      toast({ title: "Success!", description: "Your link is ready." });
      trackEvent('url_shortened', { custom_slug: !!customSlug });

    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setLongUrl('');
    setCustomSlug('');
    setPassword('');
    setExpiresAt('');
    setUrlStatus('idle');
    setAliasStatus('idle');
    setCopied(false);
  };

  // SUCCESS VIEW
  if (successData) {
    const fullShortUrl = getShortUrl(successData);
    
    return (
      <Card className="max-w-4xl mx-auto shadow-2xl border-primary/10 overflow-hidden relative z-10 animate-fade-in glass-card">
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-primary/5 z-0 pointer-events-none" />
        <CardContent className="p-8 sm:p-12 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 shadow-sm border border-success/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your link is ready!</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Share it anywhere. Track its performance in the analytics dashboard.</p>
          
          <div className="w-full max-w-lg mb-8">
            <div className="flex items-center w-full shadow-sm rounded-xl overflow-hidden border-2 border-primary/20 bg-white group hover:border-primary transition-colors">
              <div className="flex-1 p-4 font-mono text-lg sm:text-xl text-primary font-bold truncate text-left select-all overflow-x-auto custom-scrollbar">
                {fullShortUrl}
              </div>
              <Button 
                onClick={() => handleCopy(fullShortUrl)}
                className={`h-full rounded-none px-6 text-base font-semibold transition-all duration-300 ${copied ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary/90'}`}
              >
                {copied ? (
                  <><CheckCircle2 className="mr-2 w-5 h-5" /> Copied!</>
                ) : (
                  <><Copy className="mr-2 w-5 h-5" /> Copy</>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mb-8">
            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setIsQrModalOpen(true)}>
              <QrCode className="mr-2 w-5 h-5 text-gray-600" /> View QR Code
            </Button>
            <Button variant="secondary" className="flex-1 h-12 rounded-xl" onClick={() => {
              const tabsList = document.querySelector('[role="tablist"]');
              if (tabsList) {
                const analyticsTab = tabsList.querySelector('[value="analytics"]');
                if (analyticsTab) analyticsTab.click();
              }
              toast({ title: "Switched to Analytics View" });
            }}>
              <BarChart2 className="mr-2 w-5 h-5" /> Analytics
            </Button>
          </div>

          <div className="w-full border-t border-gray-100 pt-8 mt-2">
            <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Share directly</p>
            <ShareButtons url={fullShortUrl} title="Check out this link!" />
          </div>

          <Button variant="ghost" className="mt-8 text-gray-500 hover:text-gray-900" onClick={handleReset}>
            <RefreshCw className="mr-2 w-4 h-4" /> Shorten another URL
          </Button>

          <QRCodeModal 
            isOpen={isQrModalOpen} 
            onClose={() => setIsQrModalOpen(false)} 
            url={fullShortUrl} 
          />
        </CardContent>
      </Card>
    );
  }

  // FORM VIEW
  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-primary/10 overflow-hidden relative z-10 glass-card">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 z-0 pointer-events-none" />
      <CardContent className="p-6 sm:p-8 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
               <label className="text-sm font-semibold text-gray-700">Paste your long link here</label>
               {urlStatus === 'valid' && <span className="text-xs font-medium text-success flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Valid URL</span>}
               {urlStatus === 'invalid' && <span className="text-xs font-medium text-destructive flex items-center"><XCircle className="w-3 h-3 mr-1"/> Invalid URL</span>}
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    className={`pl-11 h-14 text-base rounded-xl bg-white shadow-sm transition-colors ${
                      urlStatus === 'valid' ? 'input-success' : 
                      urlStatus === 'invalid' ? 'input-error' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || urlStatus === 'invalid' || dateError || aliasStatus === 'taken'} 
                  size="lg" 
                  className="h-14 px-8 rounded-xl shrink-0 text-base font-semibold transition-all w-full sm:w-auto"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <><ArrowRight className="mr-2 h-5 w-5" /> Shorten URL</>
                  )}
                </Button>
              </div>
              
              {/* Link Preview pops up when URL is valid */}
              {urlStatus === 'valid' && (
                <div className="mt-2 animate-scale-in">
                  <LinkPreviewCard url={longUrl} />
                </div>
              )}
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full bg-white/80 rounded-xl border border-gray-100 shadow-sm backdrop-blur-sm">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50/50 rounded-xl transition-colors">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Settings className="mr-2 h-4 w-4 text-primary" /> Advanced Options
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 space-y-6">
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">Custom Alias <span className="text-gray-400 font-normal">(Optional)</span></label>
                    {aliasStatus === 'checking' && <Loader2 className="w-3 h-3 animate-spin text-gray-400"/>}
                    {aliasStatus === 'available' && <span className="text-xs text-success flex items-center"><CheckCircle2 className="w-3 h-3 mr-1"/> Available</span>}
                    {aliasStatus === 'taken' && <span className="text-xs text-destructive flex items-center"><XCircle className="w-3 h-3 mr-1"/> Taken</span>}
                    {aliasStatus === 'invalid' && <span className="text-xs text-warning flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Too short</span>}
                  </div>
                  <div className={`flex items-center w-full shadow-sm rounded-lg overflow-hidden border bg-white transition-colors ${
                    aliasStatus === 'available' ? 'border-success ring-1 ring-success/20' :
                    aliasStatus === 'taken' ? 'border-destructive ring-1 ring-destructive/20' : 'border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
                  }`}>
                    <span className="text-gray-500 text-sm px-4 py-2.5 bg-gray-50 border-r border-gray-200 font-mono hidden sm:inline-block">
                      {window.location.host}/
                    </span>
                    <Input
                      placeholder="my-custom-name"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                      className="border-0 focus-visible:ring-0 rounded-none h-11"
                      maxLength={30}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Use 3-30 letters, numbers, or hyphens to create a memorable link.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Password Protection</label>
                        {passwordStrength && (
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            passwordStrength === 'weak' ? 'bg-destructive/10 text-destructive' :
                            passwordStrength === 'medium' ? 'bg-warning/20 text-warning-foreground' : 'bg-success/10 text-success'
                          }`}>
                            {passwordStrength}
                          </span>
                        )}
                      </div>
                      <div className="relative w-full">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                              type="password"
                              placeholder="Require a password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-9 h-11 bg-white"
                          />
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight">Restrict access to your link with a secure password.</p>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Expiration Date</label>
                      <div className="relative w-full">
                          <CalendarOff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                              type="datetime-local"
                              value={expiresAt}
                              onChange={(e) => setExpiresAt(e.target.value)}
                              className={`pl-9 h-11 bg-white ${dateError ? 'border-destructive' : ''}`}
                              min={new Date().toISOString().slice(0, 16)}
                          />
                      </div>
                      {dateError ? (
                        <p className="text-[11px] text-destructive flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{dateError}</p>
                      ) : (
                        <p className="text-[11px] text-gray-500 leading-tight">Link will automatically expire and become inaccessible.</p>
                      )}
                   </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLinkForm;