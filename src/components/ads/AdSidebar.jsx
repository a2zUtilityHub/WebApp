
import React from 'react';

const AdSidebar = ({ 
  position = 'right', 
  sticky = true, 
  stickyOffset = 80, 
  width = '300px', 
  children 
}) => {
  if (!children) return null;

  // Render children conditionally handling empty arrays gracefully
  const hasChildren = React.Children.toArray(children).filter(Boolean).length > 0;
  if (!hasChildren) return null;

  return (
    <aside 
      className={`ad-sidebar ${position}`}
      style={{ 
        width,
        top: sticky ? `${stickyOffset}px` : 'auto',
        position: sticky ? 'sticky' : 'relative'
      }}
    >
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </aside>
  );
};

export default AdSidebar;
