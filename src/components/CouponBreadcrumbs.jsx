import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

const CouponBreadcrumbs = ({ storeName }) => {
  return (
    <Breadcrumbs 
      items={[
        { title: 'Coupons', to: '/coupons' },
        { title: storeName || 'Store', to: '#' }
      ]} 
      className="mb-6"
    />
  );
};

export default CouponBreadcrumbs;