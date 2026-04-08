import React from 'react';
import { Menu, Bell, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminTopBar = ({ onMobileMenuToggle }) => {
  const { profile, adminUser, adminSignOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu - Visible only on mobile/tablet */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMobileMenuToggle} 
          className="lg:hidden text-muted-foreground hover:text-foreground focus:bg-accent rounded-xl transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        {/* Context Title for Desktop */}
        <div className="hidden lg:block">
           <h2 className="text-lg font-semibold tracking-tight text-foreground">Admin Workspace</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-[hsl(var(--admin-bg))]"></span>
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors hidden sm:flex" onClick={() => navigate('/admin/settings')}>
          <Settings className="h-5 w-5" />
        </Button>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 focus-visible:ring-primary transition-all p-0">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={profile?.avatar_url} alt="Admin" className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                  {String(profile?.first_name || adminUser?.email || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-foreground">
                  {profile?.first_name} {profile?.last_name || 'Admin'}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                  {adminUser?.email || 'admin@example.com'}
                </p>
                <div className="mt-2.5 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    {adminUser?.roles?.name || 'Super Admin'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="cursor-pointer py-2 rounded-lg m-1">
              <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> 
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2 rounded-lg m-1">
              <LogOut className="w-4 h-4 mr-2" /> 
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminTopBar;