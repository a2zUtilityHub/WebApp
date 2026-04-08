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

      <div className="container mx-auto px-4 py-16 relative">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <Breadcrumbs items={[{ title: "Contact Us", to: "/contact-us" }]} className="mb-12 relative z-10" />

        <div className="grid lg:grid-cols-2 gap-12 w-full relative z-10">
          <div className="space-y-8 w-full">
            <div className="grid gap-6 w-full">
                {[
                    { icon: Mail, title: "Email Us", desc: "Our friendly team is here to help.", val: "support@a2zutilityhub.com", href: "mailto:support@a2zutilityhub.com" },
                    { icon: MapPin, title: "Visit Us", desc: "Come say hello at our office HQ.", val: "123 Utility Lane, Tech City", href: "#" },
                    { icon: Phone, title: "Call Us", desc: "Mon-Fri from 9am to 6pm.", val: "+1 (555) 123-4567", href: "tel:+15551234567" }
                ].map((item, i) => (
                    <Card key={i} className="border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full rounded-3xl overflow-hidden group">
                        <CardContent className="flex items-start gap-5 p-6 w-full">
                            <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-300 border border-primary/20"><item.icon className="h-6 w-6" /></div>
                            <div className="w-full pt-1">
                                <h3 className="font-extrabold text-xl text-foreground mb-1">{item.title}</h3>
                                <p className="text-muted-foreground text-[15px] mb-2">{item.desc}</p>
                                <a href={item.href} className="font-bold text-primary hover:text-primary/80 transition-colors break-all">{item.val}</a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border border-border/50 bg-background/60 backdrop-blur-xl rounded-3xl shadow-sm w-full">
                <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                    <CardTitle className="text-xl">Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 w-full p-6">
                    <div className="flex justify-between text-[15px] w-full border-b border-border/50 pb-3"><span className="text-muted-foreground font-medium">Monday - Friday</span><span className="font-bold text-foreground">9:00 AM - 6:00 PM</span></div>
                    <div className="flex justify-between text-[15px] w-full border-b border-border/50 pb-3"><span className="text-muted-foreground font-medium">Saturday</span><span className="font-bold text-foreground">10:00 AM - 2:00 PM</span></div>
                    <div className="flex justify-between text-[15px] w-full"><span className="text-muted-foreground font-medium">Sunday</span><span className="font-bold text-destructive flex items-center gap-1.5"><Clock className="w-4 h-4"/> Closed</span></div>
                </CardContent>
            </Card>
          </div>

          <Card className="border border-border/50 bg-background/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full relative overflow-hidden group h-fit">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 to-primary"></div>
            <CardHeader className="p-8 md:p-10 pb-6 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">Send a message</CardTitle>
              <CardDescription className="text-base mt-2">Fill out the form below and our team will get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent className="w-full p-8 md:p-10 pt-8">
              {submitted ? (
                  <div className="text-center py-12 w-full">
                      <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20 shadow-sm">
                          <CheckCircle2 className="h-10 w-10 text-success" />
                      </div>
                      <h3 className="text-2xl font-extrabold mb-3 text-foreground">Message Sent!</h3>
                      <p className="text-muted-foreground text-lg mb-8 max-w-xs mx-auto">Thank you for contacting us. We have received your inquiry and will be in touch soon.</p>
                      <Button onClick={() => setSubmitted(false)} variant="outline" className="h-12 rounded-xl px-8 border-border/50 hover:bg-muted/50">Send Another Message</Button>
                  </div>
              ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="grid sm:grid-cols-2 gap-6 w-full">
                      <div className="w-full">
                        <Input id="name" label="Full Name *" placeholder="e.g. John Doe" required value={formData.name} onChange={handleChange} className="w-full" />
                      </div>
                      <div className="w-full">
                        <Input id="email" type="email" label="Email Address *" placeholder="e.g. john@example.com" required value={formData.email} onChange={handleChange} className="w-full" />
                      </div>
                    </div>
                    <div className="w-full">
                      <Input id="subject" label="Subject *" placeholder="How can we help you?" required value={formData.subject} onChange={handleChange} className="w-full" />
                    </div>
                    <div className="w-full">
                      <Textarea id="message" label="Message *" placeholder="Tell us more about your inquiry..." rows={6} required value={formData.message} onChange={handleChange} className="w-full" />
                    </div>
                    <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-4" disabled={submitting}>
                        {submitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin"/> : <Send className="mr-3 h-5 w-5"/>} 
                        Send Message Securely
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