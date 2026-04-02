import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const AdminAccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-in fade-in duration-500">
      <Helmet>
        <title>Access Denied - Admin</title>
      </Helmet>
      
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ShieldAlert className="w-16 h-16 text-destructive" />
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight mb-2 text-foreground">Access Denied</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        You do not have the necessary permissions to view this page. Please contact your system administrator if you believe this is an error.
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
        <Button onClick={() => navigate('/admin/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AdminAccessDenied;