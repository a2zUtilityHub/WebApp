import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge, VisibilityBadge, FeaturedBadge } from './PlanBadges';
import { Edit2, Trash2, Copy, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/currency';

const PlansList = ({ plans, onEdit, onDelete, onDuplicate, loading }) => {
  if (loading) {
     return <div className="p-12 text-center text-muted-foreground">Loading plans...</div>;
  }

  if (plans.length === 0) {
     return (
        <div className="p-16 flex flex-col items-center justify-center text-center border border-dashed rounded-xl bg-muted/20">
           <h3 className="text-lg font-semibold">No plans found</h3>
           <p className="text-muted-foreground mb-4">Get started by creating your first subscription plan.</p>
        </div>
     );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Plan Name</TableHead>
            <TableHead>Price (Monthly)</TableHead>
            <TableHead>Price (Yearly)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id} className="hover:bg-muted/50 transition-colors group">
              <TableCell>
                <div className="flex items-center gap-2">
                   <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: plan.color || '#64748b' }} 
                   />
                   <span className="font-semibold">{plan.name}</span>
                   <FeaturedBadge isFeatured={plan.is_featured} />
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1 ml-5">
                   {plan.description || 'No description'}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                 {formatCurrency(plan.monthly_price, plan.currency || 'USD')}
              </TableCell>
              <TableCell className="text-muted-foreground">
                 {formatCurrency(plan.yearly_price, plan.currency || 'USD')}
              </TableCell>
              <TableCell>
                 <StatusBadge status={plan.status} />
              </TableCell>
              <TableCell>
                 <VisibilityBadge visibility={plan.visibility} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(plan)}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(plan)}>
                      <Copy className="mr-2 h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(plan.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlansList;