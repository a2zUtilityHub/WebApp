
import React from 'react';
import AuthModal from '@/components/auth/AuthModal';

export const AppLoginModal = ({ isOpen, onClose, defaultView = 'login' }) => {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      defaultView={defaultView}
    />
  );
};

export default AppLoginModal;
