import React from 'react';
import '../styles/dashboard.css';

export default function Layout({ children }) {
  return (
    <div className="gaming-layout">
      <div className="dashboard-container">
        {children}
        <footer className="dashboard-footer">
          <p>by Andrew S</p>
        </footer>
      </div>
    </div>
  );
}
