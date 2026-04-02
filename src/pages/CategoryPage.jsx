import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CategoryBreadcrumbs from '@/components/CategoryBreadcrumbs';
import CouponCard from '@/components/coupons/CouponCard';

const CategoryPage = () => {
    const { category } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const formatCategoryName = (slug) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Fetch actual category if exists
                const { data: catDb } = await supabase.from('categories').select('*').eq('slug', category).single();
                
                const catName = catDb ? catDb.name : formatCategoryName(category);
                setCategoryData({ name: catName, slug: category, description: `Best deals and coupons for ${catName}.` });

                const { data: couponsData } = await supabase
                    .from('coupons')
                    .select('*, merchant:merchants(*), category:categories(*)')
                    .eq('status', 'published')
                    .eq('category.slug', category); // Assuming joined filtering works or needs adjustment based on DB structure
                
                // Fallback filtering if joined query complexity is an issue in simple client
                const { data: allCoupons } = await supabase.from('coupons').select('*, merchant:merchants(*), category:categories(*)').eq('status', 'published');
                const filtered = allCoupons?.filter(c => c.category?.slug === category) || [];
                
                setCoupons(filtered);

            } catch (error) {
                console.error("Error fetching category:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [category]);

    const filteredCoupons = coupons.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;

    return (
        <div className="min-h-screen bg-background pb-12">
            <Helmet>
                <title>{categoryData?.name} Coupons & Deals | a2z Utility Hub</title>
                <meta name="description" content={`Find the best ${categoryData?.name} coupons, discount codes, and deals from top brands.`} />
            </Helmet>

            <div className="bg-primary/5 py-12">
                <div className="container">
                    <CategoryBreadcrumbs categoryName={categoryData?.name} />
                    <h1 className="text-4xl font-bold mb-2">{categoryData?.name} Deals</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">Explore exclusive savings on {categoryData?.name.toLowerCase()}. Handpicked and verified for you.</p>
                </div>
            </div>

            <div className="container py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center"><Filter className="w-4 h-4 mr-2"/> Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search deals..." 
                                            className="pl-8" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Brands</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(new Set(coupons.map(c => c.merchant?.name))).filter(Boolean).map(brand => (
                                            <Badge key={brand} variant="outline" className="cursor-pointer hover:bg-muted">{brand}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                         <Card>
                            <CardHeader><CardTitle className="text-lg">Popular Categories</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {['mobiles', 'travel-and-tours', 'gift-and-flowers', 'watch'].map(cat => (
                                        <Link key={cat} to={`/categories/${cat}`} className={`text-sm hover:text-primary ${category === cat ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                                            {formatCategoryName(cat)}
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {filteredCoupons.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCoupons.map(coupon => (
                                    <CouponCard key={coupon.id} coupon={coupon} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 border rounded-xl">
                                <h3 className="text-xl font-semibold mb-2">No coupons found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or check back later for new deals in {categoryData?.name}.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;