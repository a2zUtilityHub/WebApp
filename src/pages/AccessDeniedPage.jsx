import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { Helmet } from 'react-helmet';

const AccessDeniedPage = () => {
  const { role } = useUserPermissions();

  return (
    <>
      <Helmet>
        <title>Access Denied - A2Z Utility Hub</title>
      </Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          You do not have the necessary permissions to access this page.
        </p>
        {role && (
          <p className="mt-1 text-sm text-muted-foreground">
            Current Role: <span className="font-medium text-foreground">{role}</span>
          </p>
        )}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/admin/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccessDeniedPage;