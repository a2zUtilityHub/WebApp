import React from 'react';
import { AlertCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { classifyError, getUserFriendlyMessage } from '@/utils/supabaseErrorHandler';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    };
  }

  static getDerivedStateFromError(error) {
    const errorType = classifyError(error).type;
    return {
      hasError: true,
      error,
      errorType
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[GlobalErrorBoundary] Caught error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    this.setState({ errorInfo });

    // Log to external error tracking service if available
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown'
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  getErrorTitle = () => {
    const titles = {
      network: 'Connection Lost',
      timeout: 'Request Timed Out',
      permission: 'Access Denied',
      auth: 'Authentication Required',
      server: 'Server Error',
      rate_limit: 'Too Many Requests',
      edge_function: 'Service Unavailable',
      not_found: 'Not Found',
      unknown: 'Something Went Wrong'
    };

    return titles[this.state.errorType] || titles.unknown;
  };

  getErrorIcon = () => {
    return <AlertCircle className="h-12 w-12 text-destructive" />;
  };

  render() {
    if (this.state.hasError) {
      // Fixed: Replaced process.env.NODE_ENV with import.meta.env.DEV
      const isDevelopment = import.meta.env.DEV;
      const userMessage = getUserFriendlyMessage(this.state.error);

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <Alert variant="destructive" className="border-2">
              <div className="flex flex-col items-center text-center space-y-6 py-8">
                {this.getErrorIcon()}
                
                <div className="space-y-2">
                  <AlertTitle className="text-2xl font-bold">
                    {this.getErrorTitle()}
                  </AlertTitle>
                  <AlertDescription className="text-base">
                    {userMessage}
                  </AlertDescription>
                </div>

                {isDevelopment && this.state.error && (
                  <details className="w-full text-left">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      Technical Details (Development Only)
                    </summary>
                    <div className="mt-4 p-4 bg-muted rounded-lg text-xs font-mono overflow-auto max-h-64">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      {this.state.error.stack && (
                        <div className="mb-2">
                          <strong>Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
                        </div>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    onClick={this.handleReset}
                    variant="default"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>

                  {this.state.errorType === 'network' || this.state.errorType === 'server' ? (
                    <Button
                      onClick={this.handleReload}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reload Page
                    </Button>
                  ) : (
                    <Button
                      onClick={this.handleGoHome}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Go Home
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>If this problem persists, please contact support:</p>
                  <a
                    href="mailto:support@example.com"
                    className="inline-flex items-center text-primary hover:underline mt-2"
                  >
                    <Mail className="mr-1 h-4 w-4" />
                    support@example.com
                  </a>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;