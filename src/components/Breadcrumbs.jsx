import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumbs = ({ className, items = [], customNames = {} }) => {
  const location = useLocation();
  
  // If items are explicitly provided, use them
  if (items.length > 0) {
    return (
      <nav className={cn("flex items-center text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1">
          <li className="flex items-center">
            <Link to="/" className="hover:text-primary transition-colors flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={item.to || index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground">{item.title}</span>
              ) : (
                <Link to={item.to} className="hover:text-primary transition-colors">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Otherwise, auto-generate from path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbItems = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    // Use custom name if provided, otherwise format the path segment
    const title = customNames[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return { title, to };
  });

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        <li className="flex items-center">
          <Link to="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={item.to || index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-foreground">{item.title}</span>
            ) : (
              <Link to={item.to} className="hover:text-primary transition-colors">
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;