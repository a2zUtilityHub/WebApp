import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="border-t bg-card py-4 px-6 text-center text-sm text-muted-foreground">
      &copy; {new Date().getFullYear()} A2Z Utility Hub Admin Panel. All rights reserved.
    </footer>
  );
};

export default AdminFooter;