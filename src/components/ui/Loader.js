import React from 'react';
import './ui.css';

export const Loader = ({ size = 'md', color = 'primary' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className={`loader-spinner spinner-${color}`}></div>
    </div>
  );
};

export const FullPageLoader = ({ message = 'Loading premium experience...' }) => {
  return (
    <div className="full-page-loader animate-fade-in">
      <div className="full-page-loader-content">
        <Loader size="lg" />
        <p className="loader-message animate-slide-up">{message}</p>
      </div>
    </div>
  );
};
