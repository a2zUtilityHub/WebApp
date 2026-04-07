import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { usePageVisibility } from '@/hooks/usePageVisibility';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Clock, Send, Loader2, Linkedin, Twitter, Instagram, Youtube, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSection from '@/components/HeroSection';
import NotFoundPage from './NotFoundPage';
import AdSenseContainer from '@/components/ads/AdSenseContainer';
import AdSenseResponsive from '@/components/ads/AdSenseResponsive';
import { useAdSense } from '@/contexts/AdSenseProvider';

const ContactPage = () => {
  const { getPageVisibility } = usePageVisibility();
  const { toast } = useToast();
  const { shouldShowAds } = useAdSense();
  
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: ''
  });

  useEffect(() => {
    const checkVisibility = async () => {
        const visible = await getPageVisibility('contact-us');
        setIsVisible(visible);
        setLoading(false);
    };
    checkVisibility();
  }, [getPageVisibility]);

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
        const { error } = await supabase.from('support_tickets').insert([{
            subject: formData.subject,
            description: `From: ${formData.name} (${formData.email})\n\n${formData.message}`,
            status: 'open',
            priority: 'medium'
        }]);

        if (error) throw error;

        setSubmitted(true);
        toast({
            title: "Message Sent Successfully!",
            description: "We have received your message and will respond shortly.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
        toast({
            title: "Error Sending Message",
            description: "Please try again later or email us directly.",
            variant: "destructive"
        });
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-brand-primary"/></div>;
  if (!isVisible) return <NotFoundPage />;

  return (
    <div className="min-h-screen bg-background pb-12 w-full">
      <Helmet>
        <title>Contact Us | a2z Utility Hub</title>
        <meta name="description" content="Get in touch with a2z Utility Hub. We are here to help." />
      </Helmet>
      
      <HeroSection 
        title="Welcome to Contact Us"
        subtitle="Get in touch with our team - we're here to help"
      />

      {shouldShowAds && (
        <AdSenseContainer className="mt-8 w-full px-4">
            <AdSenseResponsive slot="contact_top" />
        </AdSenseContainer>
      )}

      <div className="w-full px-4 py-12">
        <Breadcrumbs items={[{ title: "Contact Us", to: "/contact-us" }]} className="mb-12" />

        <div className="grid lg:grid-cols-2 gap-12 w-full">
          <div className="space-y-8 w-full">
            <div className="grid gap-6 w-full">
                {[
                    { icon: Mail, title: "Email Us", desc: "Our friendly team is here to help.", val: "support@a2zutilityhub.com", href: "mailto:support@a2zutilityhub.com" },
                    { icon: MapPin, title: "Visit Us", desc: "Come say hello at our office HQ.", val: "123 Utility Lane, Tech City", href: "#" },
                    { icon: Phone, title: "Call Us", desc: "Mon-Fri from 9am to 6pm.", val: "+1 (555) 123-4567", href: "tel:+15551234567" }
                ].map((item, i) => (
                    <Card key={i} className="border-brand-primary/10 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all w-full">
                        <CardContent className="flex items-start gap-4 p-6 w-full">
                            <div className="bg-brand-primary/10 p-3 rounded-full text-brand-primary"><item.icon className="h-6 w-6" /></div>
                            <div className="w-full">
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-muted-foreground text-sm mb-1">{item.desc}</p>
                                <a href={item.href} className="font-medium text-brand-primary hover:underline break-all">{item.val}</a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-brand-primary/20 w-full">
                <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 w-full">
                    <div className="flex justify-between text-sm w-full"><span className="text-muted-foreground">Mon - Fri</span><span className="font-medium">9:00 AM - 6:00 PM</span></div>
                    <div className="flex justify-between text-sm w-full"><span className="text-muted-foreground">Saturday</span><span className="font-medium">10:00 AM - 2:00 PM</span></div>
                    <div className="flex justify-between text-sm w-full"><span className="text-muted-foreground">Sunday</span><span className="font-medium text-destructive">Closed</span></div>
                </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl border-t-4 border-t-brand-primary w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-brand-primary">Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              {submitted ? (
                  <div className="text-center py-12 w-full">
                      <div className="w-16 h-16 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-success/20">
                          <CheckCircle2 className="h-8 w-8 text-success" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">Thank you for contacting us. We will be in touch soon.</p>
                      <Button onClick={() => setSubmitted(false)} variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">Send Another</Button>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <div className="space-y-2 w-full">
                        <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} className="focus-visible:ring-brand-primary focus:border-brand-primary w-full" />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                        <Input id="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} className="focus-visible:ring-brand-primary focus:border-brand-primary w-full" />
                      </div>
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                      <Input id="subject" placeholder="How can we help?" required value={formData.subject} onChange={handleChange} className="focus-visible:ring-brand-primary focus:border-brand-primary w-full" />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                      <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} required value={formData.message} onChange={handleChange} className="resize-none focus-visible:ring-brand-primary focus:border-brand-primary w-full" />
                    </div>
                    <Button type="submit" className="w-full h-11 text-base bg-brand-primary hover:bg-brand-primary-dark text-white" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>} 
                        Send Message
                    </Button>
                  </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;