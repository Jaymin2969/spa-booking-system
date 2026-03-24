import React from 'react';
import './Layout.css';
import useStore from '../store/useStore';

const Layout = ({ children }) => {
  const isPanelOpen = useStore((state) => state.isPanelOpen);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Booking SPA</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="/calendar" className="active">Calendar</a>
          <a href="/bookings">Bookings</a>
          <a href="/therapists">Therapists</a>
        </nav>
      </aside>
      <main className={`main-content ${isPanelOpen ? 'panel-open' : ''}`}>
        <header className="main-header">
          <div className="header-left">
            <div className="location-selector">
              <span className="location-name">Liat Towers</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            <div className="display-selector">
              <span className="display-label">Display : 15 Min</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
          
          <div className="header-center">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search Sales by phone/name" />
            </div>
          </div>

          <div className="header-right">
            <button className="filter-btn">
              Filter <span className="filter-icon">⩓</span>
            </button>
            <div className="date-controls">
              <button className="today-btn">Today</button>
              <div className="date-navigator">
                <button className="nav-btn">{'<'}</button>
                <span className="current-date">Sat, Aug 16</span>
                <button className="nav-btn">{'>'}</button>
              </div>
              <button className="calendar-btn">📅</button>
            </div>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
