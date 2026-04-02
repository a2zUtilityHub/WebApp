import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

class ErrorBoundaryWithRetry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isOffline: !navigator.onLine };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidMount() {
    this.handleOnline = () => this.setState({ isOffline: false });
    this.handleOffline = () => this.setState({ isOffline: true });
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="max-w-2xl mx-auto my-8 border-red-500/50 bg-red-500/10 animate-fade-in">
          {this.state.isOffline ? <WifiOff className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <AlertTitle className="text-lg font-semibold ml-2">
            {this.state.isOffline ? 'Connection Lost' : 'Failed to Load Content'}
          </AlertTitle>
          <AlertDescription className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-sm opacity-90">{this.state.error?.message || "An unexpected error occurred."}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleRetry}
              className="bg-background text-foreground hover:bg-muted whitespace-nowrap"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundaryWithRetry;