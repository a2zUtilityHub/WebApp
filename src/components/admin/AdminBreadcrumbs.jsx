import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are exactly on /admin, just show Home
  if (pathnames.length === 1 && pathnames[0] === 'admin') {
    return (
      <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6" aria-label="Breadcrumb">
         <Home className="w-4 h-4 mr-1" />
         <span>Admin</span>
      </nav>
    );
  }

  return (
    <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar" aria-label="Breadcrumb">
      <Link to="/admin/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="w-4 h-4 mr-1" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        // Skip the first 'admin' segment since we already added the home icon for it
        if (value === 'admin' && index === 0) return null;
        
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Truncate long UUIDs or numeric IDs to keep breadcrumbs clean
        const isId = /^[0-9a-fA-F]{8}-|^[0-9]{6,}$/.test(value);
        const displayValue = isId && value.length > 8 ? `${value.substring(0, 8)}...` : value;
        
        const formattedValue = displayValue.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
            {isLast ? (
              <span className="text-foreground" aria-current="page">
                {formattedValue}
              </span>
            ) : (
              <Link to={to} className="hover:text-foreground transition-colors">
                {formattedValue}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default AdminBreadcrumbs;