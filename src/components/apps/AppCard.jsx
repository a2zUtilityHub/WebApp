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
      <Card className="relative h-full flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 group">
        <DevelopmentBadge status={app.status} />
        <Link to={app.url || `/apps/${app.slug}`} className="flex flex-col flex-grow p-1 z-10">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-sm border border-primary/20">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                {app.name}
              </CardTitle>
            </div>
            <CardDescription className="line-clamp-3 text-[15px] text-muted-foreground leading-relaxed min-h-[60px]">
              {app.description || 'A powerful utility application to simplify your workflow.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end mt-auto pt-0">
            <Button asChild className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold shadow-sm">
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