import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AdminEmptyState = ({ 
  title = "No data found", 
  description = "There is currently no data to display in this section. Adjust your filters or create a new entry.", 
  icon: Icon = FolderSearch, 
  actionLabel, 
  onAction,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-full py-16 px-6 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/50 hover:border-primary/30", 
      className
    )}>
      <div className="flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/10">
        <Icon className="w-8 h-8 opacity-80" strokeWidth={1.5} />
      </div>
      
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      
      <p className="mb-6 text-sm text-muted-foreground max-w-[420px] leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="rounded-xl shadow-sm hover:shadow-md transition-all px-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default AdminEmptyState;