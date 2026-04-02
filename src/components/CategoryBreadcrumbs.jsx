import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

const CategoryBreadcrumbs = ({ categoryName }) => {
  return (
    <Breadcrumbs 
      items={[
        { title: 'Categories', to: '/categories' },
        { title: categoryName || 'Category', to: '#' }
      ]} 
      className="mb-6"
    />
  );
};

export default CategoryBreadcrumbs;