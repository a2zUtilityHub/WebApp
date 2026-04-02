import React from 'react';
import EmployeeForm from './EmployeeForm';

const AddEmployeeQuickAction = ({ isOpen, onClose, onSuccess }) => {
  // EmployeeForm is already a self-contained modal with form handling
  return (
    <EmployeeForm
      open={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default AddEmployeeQuickAction;