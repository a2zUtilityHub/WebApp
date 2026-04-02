import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/HeroSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useToast } from '@/components/ui/use-toast';
import { Share2, Search, TrendingUp, Gift, Twitter, Facebook, Linkedin, Mail, MessageCircle, Link2, Copy, Star, Award, CheckCircle2 } from 'lucide-react';

const ShareEarnPage = () => {
  const { toast } = useToast();
  const [shareCount] = useState(24);
  
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Find Great Content',
      description: 'Browse our apps, deals, blogs, and resources to find content worth sharing.',
      color: 'bg-blue-500'
    },
    {
      number: 2,
      icon: Share2,
      title: 'Share It',
      description: 'Use our built-in share buttons to post on social media or send to friends.',
      color: 'bg-purple-500'
    },
    {
      number: 3,
      icon: TrendingUp,
      title: 'Track Your Shares',
      description: 'Monitor engagement metrics and see how many people clicked your shared links.',
      color: 'bg-pink-500'
    },
    {
      number: 4,
      icon: Gift,
      title: 'Earn Rewards',
      description: 'Earn points for shares and engagement, redeemable for exclusive benefits.',
      color: 'bg-green-500'
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: 'Engagement Points',
      amount: '10-50',
      description: 'Points per share based on content type and engagement',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Award,
      title: 'Bonus Rewards',
      amount: '100+',
      description: 'Extra points when your shares get high engagement',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Gift,
      title: 'Monthly Prizes',
      amount: 'Top 10',
      description: 'Top sharers each month win exclusive gift cards',
      color: 'text-green-600 bg-green-100'
    }
  ];

  const sharingChannels = [
    { icon: Facebook, name: 'Facebook', color: 'text-blue-600' },
    { icon: Twitter, name: 'Twitter', color: 'text-sky-500' },
    { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-700' },
    { icon: Mail, name: 'Email', color: 'text-gray-600' },
    { icon: MessageCircle, name: 'WhatsApp', color: 'text-green-600' },
    { icon: Link2, name: 'Copy Link', color: 'text-purple-600' }
  ];

  const tips = [
    'Share content that resonates with your audience for better engagement',
    'Add a personal message or recommendation when sharing',
    'Share during peak hours (morning or evening) for maximum visibility',
    'Engage with comments on your shared posts to boost reach',
    'Mix different content types (apps, deals, blogs) to keep it interesting',
    'Join sharing challenges and competitions for bonus rewards'
  ];

  const terms = [
    'Earn points for each valid share (minimum 1 click required)',
    'Points are credited within 24 hours of engagement',
    'Spam or artificial engagement will result in disqualification',
    'Points can be redeemed for gift cards, discounts, or platform credits',
    'Minimum redemption threshold is 1000 points',
    'Monthly leaderboard resets on the 1st of each month',
    'Program terms may be modified with 30 days notice'
  ];

  const shareExample = () => {
    toast({
      title: "🚧 Demo Mode",
      description: "This is a preview. Sign in to start earning real rewards!",
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
        <title>Share & Earn | a2z Utility Hub - Earn Rewards by Sharing</title>
        <meta name="description" content="Share great content from a2z Utility Hub and earn rewards. Earn points for every share and redeem them for exclusive benefits!" />
      </Helmet>

      <HeroSection 
        title="Share & Earn Rewards"
        subtitle="Share content you love and earn points for every engagement. Redeem for amazing rewards!"
      />

      <div className="container py-12">
        <Breadcrumbs items={[{ title: "Share & Earn", to: "/share-earn" }]} className="mb-12" />

        {/* Program Overview */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-purple-500 text-white">New Program</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Turn Your Shares Into Rewards</h2>
          <p className="text-lg text-gray-600">
            Love our apps, deals, or content? Share them with your network and earn points 
            that you can redeem for gift cards, discounts, and exclusive perks!
          </p>
        </div>

        {/* Stats Card */}
        <Card className="max-w-2xl mx-auto mb-16 shadow-xl border-t-4 border-t-purple-500">
          <CardContent className="pt-8 pb-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{shareCount}</div>
                <div className="text-gray-600 text-sm">Your Shares</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">350</div>
                <div className="text-gray-600 text-sm">Points Earned</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">142</div>
                <div className="text-gray-600 text-sm">Total Clicks</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button onClick={shareExample} className="bg-brand-primary hover:bg-brand-primary-dark">
                <Share2 className="h-4 w-4 mr-2" />
                Start Sharing Now
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

        {/* Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">What You Can Earn</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Multiple ways to earn points through sharing. The more engaging your shares, the more you earn!
          </p>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center bg-white/80 backdrop-blur-sm shadow-lg h-full">
                  <CardContent className="pt-8 pb-6">
                    <div className={`${benefit.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                      <benefit.icon className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{benefit.amount}</div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sharing Channels */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Supported Sharing Channels</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Share on your favorite platforms with just one click. We support all major social networks!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {sharingChannels.map((channel, index) => (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={shareExample}>
                <CardContent className="pt-6 pb-4">
                  <channel.icon className={`h-10 w-10 mx-auto mb-2 ${channel.color}`} />
                  <p className="text-sm font-medium text-gray-700">{channel.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="mb-16 shadow-xl max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Sharing Tips & Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-brand-primary mt-0.5 shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <Card className="max-w-4xl mx-auto mb-16">
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

        {/* CTA */}
        <div className="bg-gradient-to-r from-brand-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Earning Today!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join our Share & Earn program and turn your social influence into real rewards. 
            Every share counts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-brand-primary hover:bg-gray-100 rounded-full h-12 px-8">
              <Link to="/auth">Sign Up Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full h-12 px-8">
              <Link to="/apps">Browse Content to Share</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEarnPage;