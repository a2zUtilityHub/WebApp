import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2 } from 'lucide-react';

const RecentCalculations = ({ calculations, onLoad, onDelete }) => {
  if (!calculations || calculations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No recent calculations found. Your saved calculations will appear here.
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || !isFinite(value)) return '$0.00';
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <div className="space-y-3">
      {calculations.map((calc) => (
        <Card key={calc.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex-grow truncate">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold truncate">
                  Sell Price: {formatCurrency(parseFloat(calc.inputs.sellingPrice))}
                </p>
                <p className="text-sm text-muted-foreground ml-4 flex-shrink-0">
                  {new Date(calc.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Profit: <span className="font-medium text-foreground">{formatCurrency(calc.results.profitPerProduct)}</span></span>
                <span>Margin: <span className="font-medium text-foreground">{calc.results.profitMargin.toFixed(2)}%</span></span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onLoad(calc)}>
                Load <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(calc.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentCalculations;