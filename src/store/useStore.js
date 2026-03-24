import { create } from 'zustand';
import * as api from '../services/api';
import { logger } from '../utils/logger';

const groupBookings = (bookings) => {
  return (bookings || []).reduce((acc, booking) => {
    const tId = booking.therapistId;
    if (!acc[tId]) acc[tId] = [];
    acc[tId].push(booking);
    return acc;
  }, {});
};

const useStore = create((set, get) => ({
  bookings: [],
  groupedBookings: {}, // Performance optimization: Pre-grouped by therapistId
  therapists: [],
  services: [],
  rooms: [],
  
  // UI State
  selectedDate: new Date(),
  isPanelOpen: false,
  selectedBooking: null,
  isLoading: false,
  error: null,

  // Actions
  setBookings: (bookings) => {
    set({ 
      bookings, 
      groupedBookings: groupBookings(bookings) 
    });
  },

  // Initial Data Fetch
  initializeData: async () => {
    set({ isLoading: true, error: null });
    try {
      // For assessment purposes, we might use mock data if API fails or is slow
      // In real app, we'd fetch all sequentially or in parallel
      const [therapistsRes, servicesRes] = await Promise.all([
        api.fetchTherapists({ pagination: 0, outlet: 1 }),
        api.fetchServiceCategories({ pagination: 0, outlet: 1 })
      ]);

      set({ 
        therapists: therapistsRes.data || [], 
        services: servicesRes.data || [],
        isLoading: false 
      });
      logger.info('Initialized metadata (therapists, services)');
    } catch (e) {
      logger.error('Failed to initialize data', e);
      set({ error: 'Failed to load initial data', isLoading: false });
    }
  },

  fetchBookings: async (params = {}) => {
    set({ isLoading: true });
    try {
      const res = await api.fetchBookingsList(params);
      const bookings = res.data || [];
      set({ 
        bookings, 
        groupedBookings: groupBookings(bookings),
        isLoading: false 
      });
      logger.action('Fetched bookings', { count: bookings.length });
    } catch (e) {
      logger.error('Failed to fetch bookings', e);
      set({ error: 'Failed to fetch bookings', isLoading: false });
    }
  },
  
  addBooking: async (bookingData) => {
    set({ isLoading: true });
    try {
      const res = await api.createBooking(bookingData);
      const newBooking = res.data;
      
      // Update local state
      const currentBookings = get().bookings;
      const updatedBookings = [...currentBookings, newBooking];
      set({ 
        bookings: updatedBookings,
        groupedBookings: groupBookings(updatedBookings),
        isLoading: false
      });
      
      logger.action('Booking created', newBooking);
      return newBooking;
    } catch (e) {
      logger.error('Failed to create booking', e);
      set({ error: 'Failed to create booking', isLoading: false });
      throw e;
    }
  },
  
  updateBooking: async (id, bookingData) => {
    set({ isLoading: true });
    try {
      // Optimistic update could be handled here if needed
      const res = await api.updateBooking(id, bookingData);
      const updatedBooking = res.data;
      
      const currentBookings = get().bookings;
      const updatedList = currentBookings.map(b => b.id === id ? updatedBooking : b);
      
      set({ 
        bookings: updatedList,
        groupedBookings: groupBookings(updatedList),
        isLoading: false
      });
      
      logger.action('Booking updated', updatedBooking);
    } catch (e) {
      logger.error('Failed to update booking', e);
      set({ error: 'Failed to update booking', isLoading: false });
      throw e;
    }
  },
  
  removeBooking: async (id) => {
    set({ isLoading: true });
    try {
      await api.deleteBooking(id);
      
      const currentBookings = get().bookings;
      const updatedList = currentBookings.filter(b => b.id !== id);
      
      set({ 
        bookings: updatedList,
        groupedBookings: groupBookings(updatedList),
        isLoading: false
      });
      
      logger.action('Booking removed', { id });
    } catch(e) {
      logger.error('Failed to delete booking', e);
      set({ error: 'Failed to delete booking', isLoading: false });
    }
  },

  setDate: (date) => set({ selectedDate: date }),
  openPanel: (booking = null) => {
    logger.info('Opening booking panel', booking);
    set({ isPanelOpen: true, selectedBooking: booking });
  },
  closePanel: () => set({ isPanelOpen: false, selectedBooking: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));

export default useStore;
