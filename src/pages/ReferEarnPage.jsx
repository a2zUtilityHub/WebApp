import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Share2, TrendingUp, Gift, Copy, Mail, MessageCircle, Twitter, Facebook, CheckCircle2 } from 'lucide-react';

const ReferEarnPage = () => {
  const { toast } = useToast();
  const [referralLink] = useState('https://a2zutilityhub.com/ref/USER123');
  
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your free account or log in to get your unique referral link.',
      color: 'bg-blue-500'
    },
    {
      number: 2,
      icon: Share2,
      title: 'Share Your Link',
      description: 'Share your referral link with friends via email, social media, or messaging apps.',
      color: 'bg-purple-500'
    },
    {
      number: 3,
      icon: TrendingUp,
      title: 'Track Referrals',
      description: 'Monitor your referral dashboard to see sign-ups and conversions in real-time.',
      color: 'bg-pink-500'
    },
    {
      number: 4,
      icon: Gift,
      title: 'Earn Rewards',
      description: 'Earn rewards when your friends sign up and make their first purchase using a coupon.',
      color: 'bg-green-500'
    }
  ];

  const rewards = [
    {
      icon: Gift,
      title: 'Welcome Bonus',
      amount: '$5',
      description: 'For each friend who signs up using your link'
    },
    {
      icon: TrendingUp,
      title: 'Purchase Bonus',
      amount: '$10',
      description: 'When your referred friend makes their first purchase'
    },
    {
      icon: Gift,
      title: 'Lifetime Earnings',
      amount: '5%',
      description: 'Commission on all future purchases by your referrals'
    }
  ];

  const terms = [
    'Referral rewards are credited to your account within 48 hours of qualifying action',
    'Both you and your friend must have active accounts to receive rewards',
    'Rewards can be redeemed for gift cards, discounts, or account credits',
    'Minimum payout threshold is $25',
    'Self-referrals, fake accounts, and fraudulent activity will result in account termination',
    'We reserve the right to modify the referral program terms at any time',
    'Rewards may vary based on promotions and campaigns'
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const shareVia = (platform) => {
    const message = encodeURIComponent('Join a2z Utility Hub and save big on your purchases! Use my referral link:');
    const urls = {
      email: `mailto:?subject=Join a2z Utility Hub&body=${message} ${referralLink}`,
      whatsapp: `https://wa.me/?text=${message} ${referralLink}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}&url=${referralLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`
    };
    
    window.open(urls[platform], '_blank');
    toast({
      title: "Opening Share Dialog",
      description: `Sharing via ${platform}...`,
    });
  };

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
        <title>Refer & Earn | a2z Utility Hub - Earn Rewards by Sharing</title>
        <meta name="description" content="Join our referral program and earn rewards by inviting friends to a2z Utility Hub. Get $5 for every sign-up and 5% lifetime commission!" />
      </Helmet>

      <HeroSection 
        title="Refer & Earn Rewards"
        subtitle="Share the savings with friends and earn generous rewards for every successful referral"
      />

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "Refer & Earn", to: "/refer-earn" }]} className="mb-12" />

        {/* Program Overview */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-green-500 text-white">Limited Time Offer</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Earn Up to $500 Per Month!</h2>
          <p className="text-lg text-gray-600">
            Our referral program rewards you for spreading the word about a2z Utility Hub. 
            The more you share, the more you earn. It's that simple!
          </p>
        </div>

        {/* Referral Link Card */}
        <Card className="max-w-2xl mx-auto mb-16 shadow-xl border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Unique Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button onClick={copyToClipboard} className="shrink-0 bg-brand-primary hover:bg-brand-primary-dark">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button onClick={() => shareVia('email')} variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button onClick={() => shareVia('whatsapp')} variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={() => shareVia('twitter')} variant="outline" className="w-full">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button onClick={() => shareVia('facebook')} variant="outline" className="w-full">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step) => (
              <motion.div key={step.number} variants={itemVariants}>
                <Card className="text-center h-full shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className={`${step.color} text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
                      {step.number}
                    </div>
                    <step.icon className="h-10 w-10 text-brand-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Rewards Structure */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Your Earning Potential</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Multiple ways to earn rewards with every referral. The more your friends engage, the more you earn!
          </p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {rewards.map((reward, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg h-full">
                  <CardContent className="pt-8 pb-6">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <reward.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-2">{reward.amount}</div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{reward.title}</h3>
                    <p className="text-gray-600 text-sm">{reward.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Referral Dashboard Mockup */}
        <Card className="mb-16 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Your Referral Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="text-blue-100">Total Referrals</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="text-4xl font-bold mb-2">$85</div>
                <div className="text-green-100">Total Earnings</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="text-4xl font-bold mb-2">8</div>
                <div className="text-purple-100">Active Users</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-dark">
                <Link to="/dashboard">View Full Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-brand-primary" />
              Program Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {terms.map((term, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600">{term}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-brand-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are already earning passive income through our referral program. 
            Start sharing today!
          </p>
          <Button asChild size="lg" className="bg-white text-brand-primary hover:bg-gray-100 rounded-full h-12 px-8">
            <Link to="/auth">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferEarnPage;