import React from 'react';
import './ui.css';

export const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select 
        className={`input-field ${error ? 'input-error' : ''}`} 
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};
