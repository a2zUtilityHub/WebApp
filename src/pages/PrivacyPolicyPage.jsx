import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Shield, Database, Users, Cookie, Lock, Mail, Calendar } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = 'March 3, 2026';

  const sections = [
    {
      id: 'data-collection',
      icon: Database,
      title: '1. Data Collection',
      content: `We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:
      
      • Personal information such as name, email address, and phone number
      • Account credentials and authentication data
      • Usage data including browsing history, search queries, and interaction patterns
      • Device information such as IP address, browser type, and operating system
      • Payment information for premium services (processed securely through third-party providers)
      
      We also automatically collect certain information when you visit our platform through cookies and similar tracking technologies.`
    },
    {
      id: 'data-usage',
      icon: Shield,
      title: '2. How We Use Your Data',
      content: `We use the collected information for the following purposes:
      
      • To provide, maintain, and improve our services
      • To personalize your experience and deliver relevant content and deals
      • To process transactions and send related information
      • To communicate with you about updates, offers, and platform changes
      • To analyze usage patterns and optimize platform performance
      • To detect, prevent, and address technical issues and security threats
      • To comply with legal obligations and enforce our Terms of Service
      
      We do not sell your personal information to third parties. We may share data with service providers who assist in platform operations, subject to strict confidentiality agreements.`
    },
    {
      id: 'user-rights',
      icon: Users,
      title: '3. Your Rights',
      content: `You have the following rights regarding your personal data:
      
      • Access: Request a copy of the personal information we hold about you
      • Correction: Request corrections to inaccurate or incomplete data
      • Deletion: Request deletion of your personal data (subject to legal retention requirements)
      • Portability: Receive your data in a structured, machine-readable format
      • Objection: Object to processing of your data for specific purposes
      • Restriction: Request restriction of processing in certain circumstances
      • Withdraw Consent: Withdraw consent for data processing at any time
      
      To exercise these rights, please contact us at privacy@a2zutilityhub.com. We will respond within 30 days.`
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: '4. Cookies and Tracking',
      content: `We use cookies and similar technologies to enhance your experience:
      
      • Essential Cookies: Required for platform functionality (authentication, security)
      • Analytics Cookies: Help us understand how users interact with our platform
      • Preference Cookies: Remember your settings and preferences
      • Marketing Cookies: Deliver personalized content and advertisements
      
      You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality. We respect Do Not Track signals and adjust tracking accordingly.`
    },
    {
      id: 'third-party',
      icon: Lock,
      title: '5. Third-Party Services',
      content: `Our platform integrates with third-party services that have their own privacy policies:
      
      • Payment Processors: Stripe, PayPal (for secure payment processing)
      • Analytics Providers: Google Analytics (for usage insights)
      • Cloud Storage: AWS, Supabase (for data storage and hosting)
      • Social Media Platforms: For authentication and content sharing
      
      We carefully vet all third-party providers to ensure they meet our security and privacy standards. However, we are not responsible for the privacy practices of external websites linked from our platform.`
    },
    {
      id: 'data-security',
      icon: Lock,
      title: '6. Data Security',
      content: `We implement industry-standard security measures to protect your data:
      
      • Encryption: All data transmitted is encrypted using SSL/TLS protocols
      • Access Controls: Strict authentication and authorization mechanisms
      • Regular Audits: Periodic security assessments and vulnerability testing
      • Employee Training: Staff trained on data protection best practices
      • Incident Response: Established procedures for handling security breaches
      
      While we strive to protect your data, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.`
    },
    {
      id: 'contact',
      icon: Mail,
      title: '7. Contact Us',
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
      
      Email: privacy@a2zutilityhub.com
      Address: 123 Utility Lane, Tech City, TC 12345
      Phone: +1 (555) 123-4567
      
      We are committed to resolving any privacy concerns promptly and transparently. You may also file a complaint with your local data protection authority if you believe we have not adequately addressed your concerns.`
    }
  ];

  const tableOfContents = sections.map(section => ({
    id: section.id,
    title: section.title
  }));

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | a2z Utility Hub - Your Data Protection</title>
        <meta name="description" content="Read our comprehensive Privacy Policy to understand how a2z Utility Hub collects, uses, and protects your personal information." />
      </Helmet>

      <HeroSection 
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Learn how we protect and handle your data."
      />

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "Privacy Policy", to: "/legal/privacy" }]} className="mb-12" />

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                  <Shield className="h-5 w-5 text-brand-primary" />
                  Contents
                </h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="block w-full text-left text-sm text-gray-600 hover:text-brand-primary hover:bg-brand-primary/5 px-3 py-2 rounded transition-colors"
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg mb-8 border-t-4 border-t-brand-primary">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-6">
                  At a2z Utility Hub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our platform.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Effective Date:</strong> {lastUpdated}
                  </p>
                  <p className="text-sm text-blue-900 mt-1">
                    By using our services, you agree to the terms outlined in this Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-brand-primary/10 rounded-full p-3">
                          <section.icon className="h-6 w-6 text-brand-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 flex-1">{section.title}</h2>
                      </div>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Footer Note */}
            <Card className="mt-8 bg-gradient-to-r from-brand-primary/5 to-purple-50 border-brand-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-4">Questions About Our Privacy Policy?</h3>
                <p className="text-gray-600 mb-6">
                  We're here to help. If you have any questions or concerns about how we handle your data, 
                  please don't hesitate to reach out to our privacy team.
                </p>
                <a 
                  href="mailto:privacy@a2zutilityhub.com" 
                  className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline"
                >
                  <Mail className="h-5 w-5" />
                  privacy@a2zutilityhub.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;