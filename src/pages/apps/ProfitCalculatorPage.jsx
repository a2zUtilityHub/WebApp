
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import InputSection from '@/components/apps/profit-calculator/InputSection';
import OutputSection from '@/components/apps/profit-calculator/OutputSection';
import RecentCalculations from '@/components/apps/profit-calculator/RecentCalculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Calculator, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { AppPageNavigation } from '@/components/apps/shared/AppPageNavigation';
import { AboutSection, ManualSection, FAQSection, CommunitySection } from '@/components/apps/shared/AppSections';
import { AppTabsLayout } from '@/components/apps/shared/AppTabsLayout';
import { AppLoginModal } from '@/components/apps/shared/AppLoginModal';

const calculatorData = {
  about: {
    title: "Profit Calculator",
    description: "An advanced tool for e-commerce sellers, dropshippers, and business owners to accurately determine profit margins, calculate breakeven points, and optimize pricing strategies.",
    features: [
      { icon: <Calculator className="w-6 h-6" />, title: "Instant Calculations", desc: "See your profit margins update in real-time as you enter your costs." },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Breakeven Analysis", desc: "Know exactly how many units you need to sell to cover fixed costs." },
      { icon: <DollarSign className="w-6 h-6" />, title: "Pricing Suggestions", desc: "Get AI-driven price suggestions to hit your target profit margins." },
    ],
    benefits: [
      "Avoid selling at a loss by factoring in all hidden fees.",
      "Make data-driven decisions on product pricing.",
      "Easily calculate platform fees for Amazon, eBay, or Shopify.",
      "Save calculation history for future reference."
    ]
  },
  manual: {
    title: "Profit Calculator",
    steps: [
      { title: "Enter Product Cost", desc: "Input the manufacturing or wholesale cost of the item." },
      { title: "Add Variable Costs", desc: "Include shipping, packaging, and any other per-unit costs." },
      { title: "Set Platform Fees", desc: "Enter marketplace fees as a percentage or fixed amount." },
      { title: "Analyze Output", desc: "Review the Profit Margin, Net Profit, and suggested retail prices." }
    ],
    tips: [
      "Always include marketing and ad spend in your calculations.",
      "Use the 'Save Calculation' button to compare different pricing scenarios.",
      "Check the suggested pricing to easily hit 30% or 50% margins."
    ]
  },
  faq: [
    { q: "How is profit margin calculated?", a: "Profit Margin = (Selling Price - Total Expenses) / Selling Price * 100." },
    { q: "Can I change currency?", a: "The calculator is currency agnostic. It works with any currency values you input." },
    { q: "Are calculations saved?", a: "Yes, you can save calculations locally to your browser using the Save button." }
  ]
};

const ProfitCalculatorPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const initialInputs = {
    productCost: '', shippingCost: '', packagingCost: '', marketingCost: '',
    platformFee: '', platformFeeType: 'percentage', additionalCost: '',
    sellingPrice: '', taxEnabled: false, taxRate: '',
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [results, setResults] = useState({ totalExpenses: 0, profitPerProduct: 0, profitMargin: 0, breakevenUnits: 0, suggestedPrices: { 20: 0, 30: 0, 50: 0 } });
  const [recentCalculations, setRecentCalculations] = useState([]);
  const debouncedInputs = useDebounce(inputs, 400);

  useEffect(() => {
    const loadedCalcs = JSON.parse(localStorage.getItem('profitCalcs') || '[]');
    setRecentCalculations(loadedCalcs);
  }, []);

  const calculateResults = useCallback(() => {
    const productCost = parseFloat(debouncedInputs.productCost) || 0;
    const shippingCost = parseFloat(debouncedInputs.shippingCost) || 0;
    const packagingCost = parseFloat(debouncedInputs.packagingCost) || 0;
    const marketingCost = parseFloat(debouncedInputs.marketingCost) || 0;
    const platformFeeValue = parseFloat(debouncedInputs.platformFee) || 0;
    const additionalCost = parseFloat(debouncedInputs.additionalCost) || 0;
    const sellingPrice = parseFloat(debouncedInputs.sellingPrice) || 0;
    const taxEnabled = debouncedInputs.taxEnabled;
    const taxRate = parseFloat(debouncedInputs.taxRate) || 0;

    const priceBeforeTax = taxEnabled ? sellingPrice / (1 + taxRate / 100) : sellingPrice;
    const platformFee = debouncedInputs.platformFeeType === 'percentage' ? priceBeforeTax * (platformFeeValue / 100) : platformFeeValue;

    const totalExpenses = productCost + shippingCost + packagingCost + marketingCost + platformFee + additionalCost;
    const profitPerProduct = priceBeforeTax - totalExpenses;
    const profitMargin = priceBeforeTax > 0 ? (profitPerProduct / priceBeforeTax) * 100 : 0;
    const fixedCosts = marketingCost + additionalCost;
    const breakevenUnits = profitPerProduct > 0 ? Math.ceil(fixedCosts / profitPerProduct) : Infinity;

    const calculateSuggestedPrice = (margin) => {
      const baseCosts = totalExpenses - platformFee;
      if (debouncedInputs.platformFeeType === 'percentage') {
        return baseCosts / (1 - (platformFeeValue / 100) - (margin / 100));
      } else {
        return (baseCosts + platformFeeValue) / (1 - (margin / 100));
      }
    };

    setResults({
      totalExpenses, profitPerProduct, profitMargin, breakevenUnits,
      suggestedPrices: { 20: calculateSuggestedPrice(20), 30: calculateSuggestedPrice(30), 50: calculateSuggestedPrice(50) }
    });
  }, [debouncedInputs]);

  useEffect(() => { calculateResults(); }, [calculateResults]);

  const saveCalculation = () => {
    const newCalc = { id: Date.now(), timestamp: new Date().toISOString(), inputs, results };
    const updatedCalcs = [newCalc, ...recentCalculations].slice(0, 10);
    setRecentCalculations(updatedCalcs);
    localStorage.setItem('profitCalcs', JSON.stringify(updatedCalcs));
  };

  const tabsConfig = [
    { id: 'about', label: 'About', content: <AboutSection {...calculatorData.about} /> },
    { id: 'manual', label: 'Manual', content: <ManualSection {...calculatorData.manual} /> },
    { id: 'faq', label: 'FAQ', content: <FAQSection faqs={calculatorData.faq} /> },
    { id: 'community', label: 'Community', content: <CommunitySection appId="profit-calculator" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Product Profit Calculator - A2Z Utility Hub</title>
        <meta name="description" content="Calculate your product's profit, margin, and breakeven point with this easy-to-use tool." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <AppPageNavigation />
        
        <div className="flex-1 space-y-16">
          
          <section id="tool" className="scroll-mt-24 py-12 px-4 max-w-7xl mx-auto animate-fade-in w-full">
            {authLoading ? (
              <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : !isAuthenticated ? (
              <div className="min-h-[60vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card text-center">
                  <CardHeader className="pb-6 pt-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                      <Calculator className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-extrabold tracking-tight">Profit Calculator</CardTitle>
                    <CardDescription className="text-base mt-3 text-muted-foreground">
                      Please log in to access the Profit Calculator and optimize your pricing strategies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 pb-8 px-8">
                    <Button size="lg" className="w-full text-md font-semibold h-12" onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}>
                      Login to Continue
                    </Button>
                    <Button variant="outline" size="lg" className="w-full h-12 border-primary/20 hover:bg-primary/5" onClick={() => { setAuthView('signup'); setIsAuthModalOpen(true); }}>
                      Create an Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Product Profit Calculator</h1>
                  <p className="mt-2 text-lg text-muted-foreground">Instantly see your profit margins and make smarter pricing decisions.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                  <div className="lg:col-span-1">
                    <InputSection inputs={inputs} setInputs={setInputs} />
                    <Button onClick={saveCalculation} className="w-full mt-6 shadow-sm"><Save className="mr-2 h-4 w-4" /> Save Calculation</Button>
                  </div>
                  <div className="lg:col-span-2">
                    <OutputSection results={results} />
                  </div>
                </div>
                {recentCalculations.length > 0 && (
                  <div className="mt-12 mb-16">
                    <Card className="shadow-sm border-border">
                      <CardHeader><CardTitle>Recent Calculations</CardTitle></CardHeader>
                      <CardContent>
                        <RecentCalculations calculations={recentCalculations} onLoad={(c) => setInputs(c.inputs)} onDelete={(id) => {
                          const updated = recentCalculations.filter(c => c.id !== id);
                          setRecentCalculations(updated);
                          localStorage.setItem('profitCalcs', JSON.stringify(updated));
                        }} />
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </section>

          <AppTabsLayout tabsConfig={tabsConfig} />

        </div>
      </div>
      
      <AppLoginModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultView={authView} 
      />
    </>
  );
};

export default ProfitCalculatorPage;
