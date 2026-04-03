
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, LayoutDashboard, MapPin, ShoppingBag, Clock, Package, CreditCard, ChevronRight, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileSection from '@/components/dashboard/ProfileSection';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'overview';
  
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Mock data for demonstration since we don't have active ecommerce queries set up in this snippet
  const mockOrders = [
    { id: 'ORD-7392', date: '2026-03-15', total: '$129.99', status: 'Delivered', items: 3 },
    { id: 'ORD-6210', date: '2026-02-28', total: '$45.50', status: 'Processing', items: 1 },
  ];

  const mockAddresses = [
    { id: 1, type: 'Home', street: '123 Main St, Apt 4B', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
  ];

  useEffect(() => {
    // Simulate fetching additional user data
    if (!authLoading && user) {
      const timer = setTimeout(() => {
        setIsLoadingData(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${tabId}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  if (authLoading) return <div className="flex justify-center min-h-[60vh] items-center w-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  const memberSince = profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Recently';

  return (
    <div className="w-full px-4 py-8 animate-fade-in">
      <Helmet><title>My Account - Dashboard</title></Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 w-full">
        <div className="section-header text-left !mb-0">
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle mt-1">Manage your profile, orders, and preferences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        <aside className="lg:col-span-1">
          <Card className="border-border/50 shadow-sm sticky top-24 w-full">
            <CardContent className="p-3">
              <nav className="flex flex-col space-y-1">
                {tabs.map(t => (
                  <Button 
                    key={t.id} 
                    variant={activeTab === t.id ? "secondary" : "ghost"} 
                    className={`w-full justify-start h-11 ${activeTab === t.id ? 'font-semibold' : 'text-muted-foreground'}`} 
                    onClick={() => handleTabChange(t.id)}
                  >
                    <t.icon className={`mr-3 h-5 w-5 ${activeTab === t.id ? 'text-primary' : ''}`} /> 
                    {t.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>
        
        <div className="lg:col-span-3 min-h-[500px] w-full">
          {isLoadingData ? (
             <div className="flex justify-center items-center h-64 bg-card rounded-xl border border-border/50 w-full">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <div className="animate-slide-in w-full">
              {activeTab === 'overview' && (
                <div className="space-y-6 w-full">
                  <Card className="border-border/50 shadow-sm overflow-hidden w-full">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-border/50 w-full">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                          {profile?.first_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Welcome back, {profile?.first_name || 'User'}!</CardTitle>
                          <CardDescription className="text-base mt-1">Member since {memberSince}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/5 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><ShoppingBag className="h-5 w-5" /></div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Total Orders</h3>
                          </div>
                          <p className="text-3xl font-bold">{mockOrders.length}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/5 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"><MapPin className="h-5 w-5" /></div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Saved Addresses</h3>
                          </div>
                          <p className="text-3xl font-bold">{mockAddresses.length}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/5 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"><CreditCard className="h-5 w-5" /></div>
                            <h3 className="font-semibold text-sm text-muted-foreground">Account Status</h3>
                          </div>
                          <p className="text-xl font-bold flex items-center gap-2">
                            Active <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Verified</Badge>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {mockOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow cursor-pointer w-full" onClick={() => handleTabChange('orders')}>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-secondary rounded-lg"><Package className="h-5 w-5 text-primary" /></div>
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> {format(new Date(order.date), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="hidden sm:block">
                            <p className="font-bold">{order.total}</p>
                            <Badge variant={order.status === 'Delivered' ? 'outline' : 'secondary'} className={order.status === 'Delivered' ? 'text-green-600 border-green-200' : ''}>{order.status}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'profile' && <ProfileSection userProfile={profile} profileCompletion={85} onProfileUpdate={() => {}} />}
              
              {activeTab === 'orders' && (
                <Card className="border-border/50 shadow-sm w-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">Order History</CardTitle>
                    <CardDescription>View and manage your recent purchases.</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full">
                    {mockOrders.length > 0 ? (
                      <div className="space-y-4 w-full">
                        {mockOrders.map(order => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border/50 bg-card gap-4 w-full">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-lg">{order.id}</h3>
                                <Badge variant="secondary" className={order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Placed on {format(new Date(order.date), 'MMMM dd, yyyy')} • {order.items} items</p>
                            </div>
                            <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                              <span className="font-bold text-lg">{order.total}</span>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 w-full">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">When you place orders, they will appear here.</p>
                        <Button onClick={() => navigate('/store')}>Start Shopping</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeTab === 'addresses' && (
                <Card className="border-border/50 shadow-sm w-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Address Management</CardTitle>
                      <CardDescription>Manage your shipping and billing addresses.</CardDescription>
                    </div>
                    <Button size="sm" className="hidden sm:flex"><Plus className="h-4 w-4 mr-2" /> Add New</Button>
                  </CardHeader>
                  <CardContent className="w-full">
                    <Button size="sm" className="w-full sm:hidden mb-6"><Plus className="h-4 w-4 mr-2" /> Add New Address</Button>
                    
                    {mockAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {mockAddresses.map(addr => (
                          <div key={addr.id} className="p-5 rounded-xl border border-border relative bg-card w-full">
                            {addr.isDefault && <Badge className="absolute top-4 right-4 bg-primary/10 text-primary hover:bg-primary/20 border-0">Default</Badge>}
                            <div className="flex items-center gap-2 mb-3 text-muted-foreground font-medium">
                              <MapPin className="h-4 w-4" /> {addr.type}
                            </div>
                            <p className="font-medium text-foreground">{profile?.first_name} {profile?.last_name}</p>
                            <p className="text-muted-foreground mt-1 text-sm">{addr.street}</p>
                            <p className="text-muted-foreground text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                            
                            <div className="flex gap-2 mt-6 pt-4 border-t border-border/50 w-full">
                              <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
                              <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10">Delete</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 w-full">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No saved addresses</h3>
                        <p className="text-muted-foreground mb-6">Add an address to speed up your checkout process.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
