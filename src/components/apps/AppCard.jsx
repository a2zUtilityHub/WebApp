import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AppWindow, 
  ArrowRight, 
  Code, 
  CheckSquare, 
  Link2, 
  Film, 
  Calculator, 
  Barcode, 
  FileCog,
  QrCode,
  Key,
  Image,
  Type,
  Hash,
  Zap,
  Box,
  Layout,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DevelopmentBadge from '@/components/apps/DevelopmentBadge';

const iconMap = {
  'Code': Code,
  'CheckSquare': CheckSquare,
  'Link2': Link2,
  'Film': Film,
  'Calculator': Calculator,
  'Barcode': Barcode,
  'FileCog': FileCog,
  'QrCode': QrCode,
  'Key': Key,
  'Image': Image,
  'Type': Type,
  'Hash': Hash,
  'Zap': Zap,
  'Box': Box,
  'Layout': Layout,
  'Scissors': Scissors,
  'AppWindow': AppWindow
};

const AppCard = ({ app, index }) => {
  const IconComponent = iconMap[app.icon] || AppWindow;
  const isDevelopment = app.status === 'Development';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="relative h-full flex flex-col overflow-hidden rounded-xl border border-gray-200/60 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-brand-primary bg-white">
        <DevelopmentBadge status={app.status} />
        <Link to={app.url || `/apps/${app.slug}`} className="flex flex-col flex-grow p-1">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-brand-primary/5 rounded-2xl">
                <IconComponent className="h-10 w-10 text-brand-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                {app.name}
              </CardTitle>
            </div>
            <CardDescription className="line-clamp-3 text-sm text-gray-600 leading-relaxed min-h-[60px]">
              {app.description || 'A powerful utility application to simplify your workflow.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end mt-auto pt-0">
            <Button asChild className="w-full group rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors duration-300">
              <span>
                {isDevelopment ? 'Preview App' : 'Open App'}
                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Button>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
};

export default AppCard;