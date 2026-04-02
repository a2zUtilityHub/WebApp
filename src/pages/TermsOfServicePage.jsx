import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FileText, Users, Shield, AlertTriangle, Copyright, Edit, Ban, Mail, Calendar } from 'lucide-react';

const TermsOfServicePage = () => {
  const lastUpdated = 'March 3, 2026';

  const sections = [
    {
      id: 'user-agreement',
      icon: Users,
      title: '1. User Agreement',
      content: `By accessing or using a2z Utility Hub ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
      
      • You must be at least 18 years old to create an account and use our services
      • You agree to provide accurate, current, and complete information during registration
      • You are responsible for maintaining the confidentiality of your account credentials
      • You agree to notify us immediately of any unauthorized use of your account
      • One person or entity may only maintain one account
      
      We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, especially if we believe you have violated these Terms of Service.`
    },
    {
      id: 'acceptable-use',
      icon: Shield,
      title: '2. Acceptable Use Policy',
      content: `You agree to use the Platform only for lawful purposes and in accordance with these Terms. You agree NOT to:
      
      • Violate any applicable laws, regulations, or third-party rights
      • Use the Platform to transmit harmful, offensive, or illegal content
      • Attempt to gain unauthorized access to any part of the Platform
      • Interfere with or disrupt the integrity or performance of the Platform
      • Engage in any automated data collection (scraping, crawling, etc.) without permission
      • Impersonate any person or entity or misrepresent your affiliation
      • Use the Platform for commercial purposes without authorization
      • Upload viruses, malware, or other malicious code
      
      Violation of this policy may result in immediate account termination and potential legal action.`
    },
    {
      id: 'intellectual-property',
      icon: Copyright,
      title: '3. Intellectual Property Rights',
      content: `All content on the Platform, including text, graphics, logos, images, software, and other materials, is owned by or licensed to a2z Utility Hub and protected by copyright, trademark, and other intellectual property laws.
      
      • You may not copy, modify, distribute, or reproduce any Platform content without written permission
      • User-generated content remains the property of the user, but you grant us a worldwide, non-exclusive license to use, display, and distribute it
      • Trademark and brand names mentioned on the Platform belong to their respective owners
      • We respect intellectual property rights and expect users to do the same
      
      If you believe your intellectual property has been infringed, please contact us at legal@a2zutilityhub.com with detailed information.`
    },
    {
      id: 'liability',
      icon: AlertTriangle,
      title: '4. Limitation of Liability',
      content: `To the fullest extent permitted by law, a2z Utility Hub and its affiliates, officers, employees, and agents shall not be liable for:
      
      • Any indirect, incidental, special, consequential, or punitive damages
      • Loss of profits, revenue, data, or business opportunities
      • Damages resulting from use or inability to use the Platform
      • Damages resulting from third-party content, products, or services accessed through the Platform
      • Damages caused by errors, omissions, interruptions, or delays in service
      
      Our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
      
      Some jurisdictions do not allow certain limitations of liability, so these limitations may not apply to you.`
    },
    {
      id: 'disclaimer',
      icon: Ban,
      title: '5. Disclaimers',
      content: `The Platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to:
      
      • Warranties of merchantability, fitness for a particular purpose, or non-infringement
      • Warranties that the Platform will be uninterrupted, error-free, or secure
      • Warranties regarding the accuracy, reliability, or completeness of content
      • Warranties regarding third-party coupons, deals, or product information
      
      We do not guarantee that:
      • All coupons will work or remain valid
      • Deals or prices listed are current or accurate
      • Third-party merchants will honor the offers displayed
      • Links to external sites will remain functional
      
      You acknowledge that your use of the Platform is at your own risk.`
    },
    {
      id: 'modifications',
      icon: Edit,
      title: '6. Modifications to Terms',
      content: `We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Platform.
      
      • We will notify users of significant changes via email or Platform notification
      • Continued use of the Platform after changes constitutes acceptance of the new terms
      • If you do not agree to the modified terms, you must stop using the Platform
      • We recommend reviewing these Terms periodically
      
      The "Last Updated" date at the top of this page indicates when the Terms were most recently revised. Material changes will be clearly indicated.`
    },
    {
      id: 'termination',
      icon: Ban,
      title: '7. Account Termination',
      content: `You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
      
      We may suspend or terminate your account immediately, without prior notice, if:
      • You violate these Terms of Service
      • You engage in fraudulent or illegal activity
      • You abuse Platform features or resources
      • We are required to do so by law
      • We discontinue the Platform or specific features
      
      Upon termination:
      • Your right to access the Platform will cease immediately
      • We may delete your account data (subject to legal retention requirements)
      • Provisions of these Terms that should survive termination will remain in effect
      
      You are responsible for backing up any data before account termination.`
    },
    {
      id: 'contact',
      icon: Mail,
      title: '8. Contact Information',
      content: `For questions, concerns, or legal inquiries regarding these Terms of Service, please contact us:
      
      Email: legal@a2zutilityhub.com
      Address: 123 Utility Lane, Tech City, TC 12345
      Phone: +1 (555) 123-4567
      
      Governing Law:
      These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
      
      Dispute Resolution:
      Any disputes arising from these Terms or your use of the Platform will be resolved through binding arbitration in accordance with [Applicable Arbitration Rules], except where prohibited by law.`
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
        <title>Terms of Service | a2z Utility Hub - Legal Terms & Conditions</title>
        <meta name="description" content="Read our comprehensive Terms of Service to understand your rights and responsibilities when using a2z Utility Hub." />
      </Helmet>

      <HeroSection 
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our platform"
      />

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "Terms of Service", to: "/legal/terms" }]} className="mb-12" />

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5 text-brand-primary" />
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-6">
                  Welcome to a2z Utility Hub. These Terms of Service ("Terms") govern your access to and use of our platform, 
                  services, and features. Please read them carefully.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm text-amber-900">
                    <strong>Effective Date:</strong> {lastUpdated}
                  </p>
                  <p className="text-sm text-amber-900 mt-1">
                    <strong>Important:</strong> By accessing or using our Platform, you acknowledge that you have read, understood, 
                    and agree to be bound by these Terms.
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
                <h3 className="font-bold text-xl text-gray-900 mb-4">Questions About These Terms?</h3>
                <p className="text-gray-600 mb-6">
                  If you have any questions or concerns about these Terms of Service, our legal team is here to assist you.
                </p>
                <a 
                  href="mailto:legal@a2zutilityhub.com" 
                  className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline"
                >
                  <Mail className="h-5 w-5" />
                  legal@a2zutilityhub.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;