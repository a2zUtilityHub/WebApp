import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, CheckSquare, Link2, Film, Calculator, Barcode, FileCog, AppWindow } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppListItem = ({ app, index }) => {
  const icons = {
    'code': <Code className="h-8 w-8 text-primary" />,
    'check-square': <CheckSquare className="h-8 w-8 text-primary" />,
    'link-2': <Link2 className="h-8 w-8 text-primary" />,
    'film': <Film className="h-8 w-8 text-primary" />,
    'calculator': <Calculator className="h-8 w-8 text-primary" />,
    'barcode': <Barcode className="h-8 w-8 text-primary" />,
    'file-cog': <FileCog className="h-8 w-8 text-primary" />,
  };
  const icon = icons[app.icon] || <AppWindow className="h-8 w-8 text-primary" />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b last:border-b-0"
    >
      <Link to={app.url || `/apps/${app.slug}`} className="block hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <h3 className="font-semibold text-lg">{app.name}</h3>
              <p className="text-muted-foreground text-sm">{app.description}</p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <div>
              Details <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default AppListItem;