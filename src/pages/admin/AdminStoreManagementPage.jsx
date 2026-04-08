
import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Users, Truck, DollarSign, Tag, Settings, BarChart2 } from 'lucide-react';
import ProductsTab from '@/components/admin/store/ProductsTab';
import OrdersTab from '@/components/admin/store/OrdersTab';
import CustomersTab from '@/components/admin/store/CustomersTab';
import InventoryTab from '@/components/admin/store/InventoryTab';
import PaymentsTab from '@/components/admin/store/PaymentsTab';
import ShippingTab from '@/components/admin/store/ShippingTab';
import CouponsTab from '@/components/admin/store/CouponsTab';
import AnalyticsTab from '@/components/admin/store/AnalyticsTab';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Navigate } from 'react-router-dom';
import AdminTopBar from '@/components/admin/AdminTopBar';

const AdminStoreManagementPage = () => {
  const { isSuperAdmin, hasPermission, loading } = useUserPermissions();

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  // Super admin bypasses all checks. Other roles need specific permission.
  if (!isSuperAdmin && !hasPermission('super_admin')) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Helmet>
        <title>Store Management | Admin Panel</title>
        <meta name="description" content="Manage your e-commerce store operations, products, orders, and analytics." />
      </Helmet>

      <AdminTopBar title="Store Management" description="Manage your complete e-commerce operations." />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 w-full h-auto p-1 mb-6 gap-1 bg-muted/50">
            <TabsTrigger value="products" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Package className="w-4 h-4 hidden sm:block" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ShoppingCart className="w-4 h-4 hidden sm:block" /> Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 hidden sm:block" /> Customers
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 hidden sm:block" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <DollarSign className="w-4 h-4 hidden sm:block" /> Payments
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Truck className="w-4 h-4 hidden sm:block" /> Shipping
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Tag className="w-4 h-4 hidden sm:block" /> Coupons
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart2 className="w-4 h-4 hidden sm:block" /> Analytics
            </TabsTrigger>
          </TabsList>

          <div className="bg-background min-h-[500px]">
            <TabsContent value="products" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="orders" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <OrdersTab />
            </TabsContent>
            <TabsContent value="customers" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <CustomersTab />
            </TabsContent>
            <TabsContent value="inventory" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <InventoryTab />
            </TabsContent>
            <TabsContent value="payments" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <PaymentsTab />
            </TabsContent>
            <TabsContent value="shipping" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <ShippingTab />
            </TabsContent>
            <TabsContent value="coupons" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <CouponsTab />
            </TabsContent>
            <TabsContent value="analytics" className="m-0 border-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              <AnalyticsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStoreManagementPage;
