import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const ImprovedLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      {children}
    </div>
  );
}

export default ImprovedLayout;
