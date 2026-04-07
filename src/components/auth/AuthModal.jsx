
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { cn } from '@/lib/utils';

const AuthModal = ({ isOpen: externalIsOpen, onClose: externalOnClose, defaultView }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  const isControlled = externalIsOpen !== undefined;

  const [isOpen, setIsOpen] = useState(isControlled ? externalIsOpen : false);
  const [view, setView] = useState(defaultView || mode || 'login');

  // Synchronize internal state with external props or URL route
  useEffect(() => {
    if (isControlled) {
      setIsOpen(externalIsOpen);
    } else {
      if (location.pathname === '/auth') {
        setIsOpen(true);
        const paramMode = searchParams.get('mode');
        if (paramMode) {
            setView(paramMode);
        } else if (!view) {
            setView('login');
        }
      } else {
        setIsOpen(false);
      }
    }
  }, [externalIsOpen, location.pathname, searchParams, isControlled, view]);

  // Update URL when view changes internally without page reload (only if uncontrolled)
  useEffect(() => {
    if (!isControlled && isOpen && view) {
        if (searchParams.get('mode') !== view && location.pathname === '/auth') {
             navigate(`/auth?mode=${view}`, { replace: true });
        }
    }
  }, [view, isOpen, navigate, location.pathname, searchParams, isControlled]);

  const handleOpenChange = (open) => {
    if (!open) {
      if (isControlled) {
        if (externalOnClose) externalOnClose();
      } else {
        setIsOpen(false);
        if (window.history.length > 2) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    }
  };

  const onAuthSuccess = () => {
    if (isControlled) {
      if (externalOnClose) externalOnClose();
    } else {
      setIsOpen(false);
      const redirect = searchParams.get('redirect');
      navigate(redirect || '/dashboard');
    }
  };

  const onSignupSuccess = () => {
    setView('login');
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm setView={setView} onAuthSuccess={onAuthSuccess} />;
      case 'signup':
        return <SignupForm setView={setView} onSignupSuccess={onSignupSuccess} />;
      case 'forgot-password':
        return <ForgotPasswordForm setView={setView} />;
      default:
        return <LoginForm setView={setView} onAuthSuccess={onAuthSuccess} />;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'login': return 'Welcome Back!';
      case 'signup': return 'Create an Account';
      case 'forgot-password': return 'Reset Your Password';
      default: return '';
    }
  };

  const getDescription = () => {
    switch (view) {
      case 'login': return 'Sign in to access your workspace and tools.';
      case 'signup': return 'Get started with your free account today.';
      case 'forgot-password': return "Enter your email to receive a reset link.";
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-card border border-border shadow-2xl" hideCloseButton>
        <DialogHeader className="p-6 pb-2 pt-8 text-center relative bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-muted"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>

          {view !== 'login' && view !== 'signup' && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 h-8 w-8 rounded-full hover:bg-muted"
              onClick={() => setView('login')}
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <DialogTitle className={cn("text-2xl font-bold tracking-tight text-foreground", view === 'forgot-password' && 'text-center')}>
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
