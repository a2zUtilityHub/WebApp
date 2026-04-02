import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchCategoryBySlug, fetchItemsByCategoryId, logDebug } from '@/utils/categoryQueryHandler';

export const useCouponCategory = (categorySlug) => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    minDiscount: 0,
    maxDiscount: 100,
    maxExpiryDays: 'all'
  });
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!categorySlug) return;
    
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch category first
      const { data: catData, error: catError } = await fetchCategoryBySlug(categorySlug);
      
      if (catError) {
        throw new Error(`Failed to load category details: ${catError.message}`);
      }
      
      if (!catData) {
        throw new Error(`Category '${categorySlug}' not found.`);
      }
      
      setCategoryInfo(catData);
      
      // 2. Fetch coupons by category ID
      const { data: couponsData, error: couponsError } = await fetchItemsByCategoryId('coupons', catData.id);
      
      if (couponsError) {
        throw new Error(`Failed to load coupons: ${couponsError.message}`);
      }
      
      setCoupons(couponsData);
      setFilteredCoupons(couponsData);
      
    } catch (err) {
      logDebug('useCouponCategory', 'Load Data Error', null, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categorySlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters and sorting locally
  useEffect(() => {
    let result = [...coupons];

    // Filter by discount
    result = result.filter(c => {
      const discountVal = parseInt(c.discount_value) || 0;
      return discountVal >= filters.minDiscount && discountVal <= filters.maxDiscount;
    });

    // Filter by expiry
    if (filters.maxExpiryDays !== 'all') {
      const maxDays = parseInt(filters.maxExpiryDays);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + maxDays);
      result = result.filter(c => !c.expires_at || new Date(c.expires_at) <= futureDate);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'popularity') return (b.click_count || 0) - (a.click_count || 0);
      if (sortBy === 'latest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'discount') return (parseInt(b.discount_value) || 0) - (parseInt(a.discount_value) || 0);
      return 0;
    });

    setFilteredCoupons(result);
  }, [coupons, filters, sortBy]);

  const handleCopyCode = (coupon) => {
    if (coupon.code) {
      navigator.clipboard.writeText(coupon.code);
      toast({ title: "Code Copied!", description: `Use code ${coupon.code} at checkout.` });
    } else if (coupon.deal_link) {
      window.open(coupon.deal_link, '_blank', 'noopener,noreferrer');
    }
  };

  const clearFilters = () => {
    setFilters({ minDiscount: 0, maxDiscount: 100, maxExpiryDays: 'all' });
    setSortBy('popularity');
  };

  return {
    coupons,
    filteredCoupons,
    categoryInfo,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    handleCopyCode,
    refetch: loadData,
    clearFilters
  };
};