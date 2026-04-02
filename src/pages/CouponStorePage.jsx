import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Loader2, Share2, Tag, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CouponBreadcrumbs from '@/components/CouponBreadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import CouponCard from '@/components/coupons/CouponCard';

const CouponStorePage = () => {
    const { store } = useParams();
    const [storeData, setStoreData] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock store data mapping for now until DB tables are fully populated by admin
    const storeInfoMap = {
        'pizzahut': { name: 'Pizza Hut', description: 'Get the best deals on pizzas, sides, and drinks.' },
        'dominos': { name: "Domino's", description: 'Save on your favorite pizzas with exclusive Domino\'s coupons.' },
        'bigbasket': { name: 'BigBasket', description: 'Fresh groceries delivered to your doorstep at discounted prices.' },
        'cleartrip': { name: 'ClearTrip', description: 'Best offers on flight bookings and hotel stays.' },
        'makemytrip': { name: 'MakeMyTrip', description: 'Plan your travel with amazing discounts on flights and hotels.' },
        'amazon': { name: 'Amazon', description: 'Shop for everything you need with top Amazon promo codes.' },
        'flipkart': { name: 'Flipkart', description: 'Electronics, fashion, and more at unbeatable prices.' },
        'godaddy': { name: 'GoDaddy', description: 'Domains, hosting, and website builders for less.' },
        'paytm': { name: 'Paytm', description: 'Recharges, bill payments, and shopping made rewarding.' },
    };

    useEffect(() => {
        const fetchStoreData = async () => {
            setLoading(true);
            try {
                const storeInfo = storeInfoMap[store] || { name: store.charAt(0).toUpperCase() + store.slice(1), description: `Best coupons for ${store}.` };
                setStoreData(storeInfo);

                const { data: couponsData, error } = await supabase
                    .from('coupons')
                    .select('*, merchant:merchants(*), category:categories(*)')
                    .eq('status', 'published')
                    .ilike('title', `%${storeInfo.name}%`); // Simple filter for demo

                if (error) throw error;
                setCoupons(couponsData || []);

            } catch (error) {
                console.error("Error fetching store data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [store]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    if (!storeData) return (
        <div className="container py-16 text-center">
            <h1 className="text-2xl font-bold">Store Not Found</h1>
            <p className="text-muted-foreground mt-2">The store you are looking for does not exist.</p>
            <Button asChild className="mt-4"><Link to="/coupons">View All Coupons</Link></Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background pb-12">
            <Helmet>
                <title>{storeData.name} Coupons & Promo Codes | a2z Utility Hub</title>
                <meta name="description" content={`Save with the latest ${storeData.name} coupons, promo codes, and discount offers. Verified and updated daily.`} />
            </Helmet>

            <div className="bg-muted/30 border-b py-12">
                <div className="container">
                    <CouponBreadcrumbs storeName={storeData.name} />
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="h-24 w-24 bg-white rounded-xl shadow-sm flex items-center justify-center p-4 border">
                            <span className="text-2xl font-bold text-primary">{storeData.name.charAt(0)}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold tracking-tight mb-2">{storeData.name} Coupons</h1>
                            <p className="text-muted-foreground max-w-2xl">{storeData.description}</p>
                            <div className="flex gap-2 mt-4 justify-center md:justify-start">
                                <Badge variant="secondary" className="px-3 py-1"><Tag className="w-3 h-3 mr-1"/> {coupons.length} Active Offers</Badge>
                                <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200"><Calendar className="w-3 h-3 mr-1"/> Updated Today</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Top {storeData.name} Offers</h2>
                            {coupons.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {coupons.map(coupon => (
                                        <CouponCard key={coupon.id} coupon={coupon} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-12 border-2 border-dashed rounded-xl">
                                    <p className="text-muted-foreground">No active coupons found for {storeData.name} at the moment.</p>
                                    <Button asChild variant="link" className="mt-2"><Link to="/coupons">Browse other stores</Link></Button>
                                </div>
                            )}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">How to use {storeData.name} Coupons?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>1. Browse the listed coupons and select the one that suits your purchase.</p>
                                <p>2. Click on "Show Code" or "Get Deal" to reveal the discount code or activate the offer.</p>
                                <p>3. Copy the code (if applicable) and you will be redirected to the {storeData.name} website.</p>
                                <p>4. Shop for your favorite items and proceed to checkout.</p>
                                <p>5. Paste the code in the "Promo Code" or "Coupon Code" field at checkout to avail the discount.</p>
                            </CardContent>
                        </Card>

                        <div className="bg-primary/5 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold mb-3 flex items-center"><Share2 className="w-4 h-4 mr-2"/> Share these savings</h3>
                            <ShareButtons />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Store Info</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-3">
                                <p className="flex justify-between"><span>Active Coupons:</span> <span className="font-medium">{coupons.length}</span></p>
                                <p className="flex justify-between"><span>Best Discount:</span> <span className="font-medium text-green-600">Up to 50% OFF</span></p>
                                <div className="pt-4 border-t mt-2">
                                    <h4 className="font-semibold mb-2 text-xs uppercase text-muted-foreground">Terms & Conditions</h4>
                                    <p className="text-xs text-muted-foreground">Offers valid for a limited time. {storeData.name} reserves the right to modify or cancel offers at any time.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Related Stores</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(storeInfoMap).filter(k => k !== store).slice(0, 5).map(k => (
                                        <Link key={k} to={`/coupons/${k}`}>
                                            <Badge variant="secondary" className="hover:bg-primary hover:text-white transition-colors cursor-pointer capitalize">
                                                {storeInfoMap[k].name}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponStorePage;