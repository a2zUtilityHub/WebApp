import { useState, useMemo } from 'react';

export const useFilters = (initialItems = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const filteredAndSortedItems = useMemo(() => {
    let result = [...initialItems];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title?.toLowerCase().includes(lowerSearch) || 
        item.description?.toLowerCase().includes(lowerSearch) ||
        item.name?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(item => 
        item.categories?.some(c => c.slug === selectedCategory) ||
        item.category_id === selectedCategory
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc': return (a.title || a.name || '').localeCompare(b.title || b.name || '');
        case 'name-desc': return (b.title || b.name || '').localeCompare(a.title || a.name || '');
        case 'price-asc': return (a.price_in_cents || 0) - (b.price_in_cents || 0);
        case 'price-desc': return (b.price_in_cents || 0) - (a.price_in_cents || 0);
        case 'newest': default: return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return result;
  }, [initialItems, searchTerm, selectedCategory, sortOption]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    filteredAndSortedItems
  };
};