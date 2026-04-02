import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Search, Filter, Save, Share, ShoppingCart, Ticket, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      number: 1,
      title: 'Browse',
      description: 'Explore our vast collection of free utility apps, exclusive deals, and helpful content.',
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      number: 2,
      title: 'Find Deals',
      description: 'Discover verified coupons and offers from top merchants across various categories.',
      icon: Ticket,
      color: 'bg-purple-500'
    },
    {
      number: 3,
      title: 'Use Coupons',
      description: 'Click to reveal coupon codes, copy them, and apply at checkout to save instantly.',
      icon: ShoppingCart,
      color: 'bg-pink-500'
    },
    {
      number: 4,
      title: 'Track Savings',
      description: 'Monitor your total savings and share your favorite deals with friends and family.',
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find exactly what you need with our powerful search and filtering system.'
    },
    {
      icon: Filter,
      title: 'Advanced Filters',
      description: 'Narrow down results by category, merchant, discount type, and more.'
    },
    {
      icon: Save,
      title: 'Save Favorites',
      description: 'Bookmark your favorite deals and apps for quick access anytime.'
    },
    {
      icon: Share,
      title: 'Share & Earn',
      description: 'Share deals with friends and earn rewards through our referral program.'
    }
  ];

  const faqs = [
    {
      question: 'How do I use a coupon code?',
      answer: 'Click on any coupon card to reveal the code, copy it, and paste it at checkout on the merchant\'s website. The discount will be applied automatically.'
    },
    {
      question: 'Are all coupons verified?',
      answer: 'Yes! Our team regularly verifies all coupons to ensure they work. We also show user success rates and last verified dates.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account is required to browse and use coupons. However, creating a free account lets you save favorites, track your savings, and access exclusive member deals.'
    },
    {
      question: 'How often are new deals added?',
      answer: 'We add new deals daily! Check back frequently or subscribe to our newsletter to get notified about the latest offers.'
    },
    {
      question: 'Are the utility apps really free?',
      answer: 'Yes, all our utility apps are completely free to use. Some may offer premium features, but the core functionality is always free.'
    },
    {
      question: 'How can I earn through the referral program?',
      answer: 'Share your unique referral link with friends. When they sign up and make their first purchase using a coupon, you both earn rewards!'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>How It Works | a2z Utility Hub - Complete Guide</title>
        <meta name="description" content="Learn how to use a2z Utility Hub to find the best deals, coupons, and free utility apps. Simple step-by-step guide to maximize your savings." />
      </Helmet>

      <HeroSection 
        title="How It Works"
        subtitle="Discover how easy it is to save money and boost productivity with a2z Utility Hub"
      />

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "How It Works", to: "/how-it-works" }]} className="mb-12" />

        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Complete Guide to Savings & Productivity</h2>
          <p className="text-lg text-gray-600">
            a2z Utility Hub makes it simple to discover exclusive deals, access powerful free tools, 
            and maximize your savings. Follow these easy steps to get started.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              <Card className="h-full border-t-4 border-t-brand-primary shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold`}>
                      {step.number}
                    </div>
                    <step.icon className="h-10 w-10 text-brand-primary" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-base leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Powerful Features</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Our platform is packed with features designed to make your experience seamless and rewarding.
          </p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center h-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-brand-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-brand-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-10">
            Have questions? We've got answers to help you get the most out of a2z Utility Hub.
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-brand-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-brand-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of smart shoppers who are already saving big with a2z Utility Hub. 
            Explore exclusive deals and powerful tools today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-primary hover:bg-gray-100 rounded-full h-12 px-8">
              <Link to="/coupons">Browse Deals <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full h-12 px-8">
              <Link to="/apps">Explore Apps</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;