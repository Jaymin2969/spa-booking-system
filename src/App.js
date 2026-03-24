import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import CalendarBoard from './pages/CalendarBoard';
import BookingsList from './pages/BookingsList';
import TherapistsList from './pages/TherapistsList';
import { FullPageLoader } from './components/ui/Loader';
import { login, fetchBookings, fetchTherapists, fetchServices, fetchRooms } from './services/api';
import { generateMockData } from './utils/mockData';
import { logger } from './utils/logger';
import useStore from './store/useStore';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        setIsInitializing(true);
        await login();
        logger.info('Authenticated. Fetching initial data...');
        
        try {
          const [bookingsData, therapistsData, servicesData, roomsData] = await Promise.all([
            fetchBookings(),
            fetchTherapists(),
            fetchServices(),
            fetchRooms()
          ]);
          
          useStore.setState({ 
            therapists: Array.isArray(therapistsData.data) ? therapistsData.data : (Array.isArray(therapistsData) ? therapistsData : []),
            bookings: Array.isArray(bookingsData.data) ? bookingsData.data : (Array.isArray(bookingsData) ? bookingsData : []),
            services: Array.isArray(servicesData.data) ? servicesData.data : (Array.isArray(servicesData) ? servicesData : []),
            rooms: Array.isArray(roomsData.data) ? roomsData.data : (Array.isArray(roomsData) ? roomsData : [])
          });
        } catch (e) {
          logger.error('API data fetch failed, using mock data', e);
          const data = generateMockData();
          useStore.setState({ 
            therapists: data.therapists,
            bookings: data.bookings,
            services: data.services,
            rooms: data.rooms
          });
        }
        
        setIsInitializing(false);
      } catch (e) {
        setAuthError('Authentication failed. Please check network or credentials.');
        logger.error('Auth failure', e);
        setIsInitializing(false);
      }
    };
    initApp();
  }, []);

  if (authError) {
    return (
      <div style={{ padding: '40px', color: '#ef4444', textAlign: 'center', background: '#fef2f2', height: '100vh' }}>
        <h2 style={{ marginBottom: '16px' }}>Initialization Failed</h2>
        <p>{authError}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  if (isInitializing) {
    return <FullPageLoader message="Initializing Natureland Spa Management System..." />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/calendar" element={<CalendarBoard />} />
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/therapists" element={<TherapistsList />} />
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
