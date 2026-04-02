import React from 'react';
import { Helmet } from 'react-helmet';
import AdminPageVisibilityManager from '@/components/admin/AdminPageVisibilityManager';
import Breadcrumbs from '@/components/Breadcrumbs';

const AdminPageVisibilityPage = () => {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Page Visibility | Admin | a2z Utility Hub</title>
      </Helmet>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <Breadcrumbs 
            items={[
                { title: 'Dashboard', to: '/admin/dashboard' },
                { title: 'Page Visibility', to: '/admin/page-visibility' }
            ]} 
         />
      </div>

      <AdminPageVisibilityManager />
    </div>
  );
};

export default AdminPageVisibilityPage;