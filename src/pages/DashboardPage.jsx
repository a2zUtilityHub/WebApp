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
    <div className="w-full px-4 py-12 animate-fade-in relative overflow-hidden bg-background min-h-screen">
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        <Helmet><title>My Account - Dashboard</title></Helmet>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 w-full">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">My Account</h1>
            <p className="text-lg text-muted-foreground mt-2">Manage your profile, orders, and preferences.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          <aside className="lg:col-span-1">
            <Card className="border border-border/50 bg-background/60 backdrop-blur-2xl shadow-lg rounded-[2rem] sticky top-24 w-full overflow-hidden">
              <CardContent className="p-4">
                <nav className="flex flex-col space-y-2">
                  {tabs.map(t => (
                    <Button 
                      key={t.id} 
                      variant={activeTab === t.id ? "secondary" : "ghost"} 
                      className={`w-full justify-start h-12 rounded-xl transition-all duration-300 ${activeTab === t.id ? 'font-bold bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`} 
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
                <div className="space-y-8 w-full">
                  <Card className="border border-border/50 bg-background/60 backdrop-blur-2xl shadow-lg rounded-[2rem] overflow-hidden w-full">
                    <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent p-8 md:p-10 border-b border-border/50 w-full relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-primary to-transparent rounded-bl-[100px] w-48 h-48 pointer-events-none z-0"></div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                        <div className="h-20 w-20 rounded-[1.5rem] bg-background border border-border/50 shadow-sm flex items-center justify-center text-primary text-3xl font-extrabold ring-4 ring-background/50">
                          {profile?.first_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Welcome back, {profile?.first_name || 'User'}!</CardTitle>
                          <CardDescription className="text-lg mt-2 text-muted-foreground/90 font-medium">Member since {memberSince}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6 md:p-8 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="p-6 rounded-3xl border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform"><ShoppingBag className="h-6 w-6" /></div>
                            <h3 className="font-bold text-[15px] text-muted-foreground">Total Orders</h3>
                          </div>
                          <p className="text-4xl font-black text-foreground">{mockOrders.length}</p>
                        </div>
                        <div className="p-6 rounded-3xl border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 group-hover:scale-110 transition-transform"><MapPin className="h-6 w-6" /></div>
                            <h3 className="font-bold text-[15px] text-muted-foreground">Saved Addresses</h3>
                          </div>
                          <p className="text-4xl font-black text-foreground">{mockAddresses.length}</p>
                        </div>
                        <div className="p-6 rounded-3xl border border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 group-hover:scale-110 transition-transform"><CreditCard className="h-6 w-6" /></div>
                            <h3 className="font-bold text-[15px] text-muted-foreground">Account Status</h3>
                          </div>
                          <p className="text-2xl font-bold flex items-center gap-2 mt-2 text-foreground">
                            Active <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded-full px-3 py-0.5">Verified</Badge>
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
    </div>
  );
};

export default DashboardPage;