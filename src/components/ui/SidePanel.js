import React, { useEffect } from 'react';
import './ui.css';
import useStore from '../../store/useStore';

export const SidePanel = ({ title, children, footer }) => {
  const isPanelOpen = useStore((state) => state.isPanelOpen);
  const closePanel = useStore((state) => state.closePanel);

  // Close panel on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isPanelOpen, closePanel]);

  return (
    <>
      <div 
        className={`side-panel-overlay ${isPanelOpen ? 'open' : ''}`} 
        onClick={closePanel}
      />
      <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h3>{title}</h3>
          <div className="side-panel-header-actions">
            <button className="panel-cancel-btn" onClick={closePanel}>Cancel</button>
          </div>
        </div>
        <div className="side-panel-body">
          {children}
        </div>
        {footer && (
          <div className="side-panel-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
