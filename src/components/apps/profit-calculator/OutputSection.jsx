import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart } from 'lucide-react';

const formatCurrency = (value) => {
  if (typeof value !== 'number' || !isFinite(value)) return '$0.00';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const ResultCard = ({ title, value, icon: Icon, colorClass, isPercentage = false }) => (
  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
    <div className="flex items-center">
      <div className={`p-2 rounded-md mr-4 ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">
          {isPercentage ? `${value.toFixed(2)}%` : value}
        </p>
      </div>
    </div>
  </div>
);

const OutputSection = ({ results }) => {
  const { totalExpenses, profitPerProduct, profitMargin, breakevenUnits, suggestedPrices } = results;
  const isProfitable = profitPerProduct > 0;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-2xl">Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResultCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={DollarSign}
          colorClass="bg-red-500"
        />
        <ResultCard
          title={isProfitable ? "Profit per Product" : "Loss per Product"}
          value={formatCurrency(profitPerProduct)}
          icon={isProfitable ? TrendingUp : TrendingDown}
          colorClass={isProfitable ? "bg-green-500" : "bg-orange-500"}
        />
        <ResultCard
          title="Profit Margin"
          value={profitMargin}
          icon={BarChart}
          colorClass="bg-blue-500"
          isPercentage
        />
        <ResultCard
          title="Breakeven Units"
          value={breakevenUnits}
          icon={Target}
          colorClass="bg-purple-500"
        />

        <div className="pt-4">
          <h4 className="font-semibold mb-2 text-lg">Suggested Selling Prices</h4>
          <div className="space-y-2">
            {Object.entries(suggestedPrices).map(([margin, price]) => (
              <div key={margin} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                <span className="text-muted-foreground">{margin}% Profit Margin</span>
                <span className="font-bold text-primary">{isFinite(price) && price > 0 ? formatCurrency(price) : 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputSection;