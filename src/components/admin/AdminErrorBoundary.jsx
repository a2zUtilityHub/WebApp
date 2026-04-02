import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo });
    // Ideally log to a service like Sentry here
  }

  render() {
    if (this.state.hasError) {
      return <AdminErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}

const AdminErrorFallback = ({ error, reset }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-background rounded-lg border border-dashed m-4">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        An unexpected error occurred in the admin panel. 
        {error?.message && <span className="block mt-2 font-mono text-xs bg-muted p-2 rounded">{error.message}</span>}
      </p>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            <Home className="mr-2 h-4 w-4" /> Go Dashboard
        </Button>
        <Button onClick={reset}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;