import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, CreditCard, Box, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const DashboardOverview = ({ profileCompletion, subscription, servicesCount }) => {
  const overviewCards = [
    {
      title: 'Profile',
      icon: User,
      link: '/settings/profile',
      content: (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Your profile is {profileCompletion}% complete.
          </p>
          <Progress value={profileCompletion} className="w-full" />
        </div>
      ),
    },
    {
      title: 'Subscription',
      icon: CreditCard,
      link: '/settings/subscription',
      content: (
        <div>
          <p className="text-sm text-muted-foreground">
            {subscription ? `Current Plan: ${subscription.plans.name}` : 'No active subscription.'}
          </p>
          <p className="text-xs text-muted-foreground">
            {subscription ? `Status: ${subscription.status}` : 'Upgrade to unlock more features.'}
          </p>
        </div>
      ),
    },
    {
      title: 'Services',
      icon: Box,
      link: '/settings/services',
      content: (
        <div>
          <p className="text-sm text-muted-foreground">
            You have {servicesCount} active services.
          </p>
          <p className="text-xs text-muted-foreground">
            Manage your purchased apps and tools.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {overviewCards.map((card, index) => (
        <motion.div
          key={card.title}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow">{card.content}</CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link to={card.link}>
                  Manage {card.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardOverview;