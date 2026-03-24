import axios from 'axios';

const BASE_URL = 'https://dev.natureland.hipster-virtual.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for FormData
const createFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

/**
 * Authentication
 */
export const login = async (email = 'react@hipster-inc.com', password = 'React@123', key_pass = '07ba959153fe7eec778361bf42079439') => {
  try {
    const formData = createFormData({ email, password, key_pass });
    const response = await api.post('/api/v1/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    let token = response.data?.data?.token || response.data?.token || response.data?.data?.data?.token;
    if (typeof token === 'object' && token !== null) {
      token = token.token;
    }
    
    if (token && typeof token === 'string') {
      localStorage.setItem('token', token);
    }
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Users
 */
export const fetchUsers = async (params = {}) => {
  const res = await api.get('/api/v1/users', { params });
  return res.data;
};

export const fetchUserById = async (id) => {
  const res = await api.get(`/api/v1/users/${id}`);
  return res.data;
};

export const createUser = async (userData) => {
  const formData = createFormData(userData);
  const res = await api.post('/api/v1/users/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

/**
 * Therapists
 */
export const fetchTherapists = async (params = {}) => {
  // Postman example params: availability=1, outlet=1, service_at, services, status, pagination, panel=outlet, outlet_type=2, leave=0
  const res = await api.get('/api/v1/therapists', { params });
  return res.data;
};

export const fetchTherapistTimings = async (params = {}) => {
  // Params: start_date, end_date, outlet
  const res = await api.get('/api/v1/therapist-timings', { params });
  return res.data;
};

/**
 * Service Categories
 */
export const fetchServiceCategories = async (params = {}) => {
  // Params: outlet_type, outlet, pagination=0, panel=outlet
  const res = await api.get('/api/v1/service-category', { params });
  return res.data;
};

/**
 * Bookings
 */
export const fetchBookingsList = async (params = {}) => {
  // POSTMAN: /api/v1/bookings/outlet/booking/list
  // Params: pagination, daterange, outlet, panel=outlet, view_type=calendar
  const res = await api.get('/api/v1/bookings/outlet/booking/list', { params });
  return res.data;
};

export const fetchBookingDetails = async (id) => {
  const res = await api.get(`/api/v1/bookings/booking-details/${id}`);
  return res.data;
};

export const createBooking = async (bookingData) => {
  const formData = createFormData(bookingData);
  const res = await api.post('/api/v1/bookings/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
  });
  return res.data;
};

export const updateBooking = async (id, bookingData) => {
  const formData = createFormData(bookingData);
  const res = await api.post(`/api/v1/bookings/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
  });
  return res.data;
};

export const updateBookingStatus = async (statusData) => {
  const formData = createFormData(statusData);
  const res = await api.post('/api/v1/bookings/update/payment-status', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
  });
  return res.data;
};

export const cancelBooking = async (cancelData) => {
  const formData = createFormData(cancelData);
  const res = await api.post('/api/v1/bookings/item/cancel', formData, {
    headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
  });
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/api/v1/bookings/destroy/${id}`);
  return res.data;
};

/**
 * Rooms
 */
export const fetchRoomBookings = async (outletId, params = {}) => {
  // Params: date, panel=outlet, duration
  const res = await api.get(`/api/v1/room-bookings/outlet/${outletId}`, { params });
  return res.data;
};

/**
 * Outlet Timings
 */
export const fetchOutletTimings = async (params = {}) => {
  const res = await api.get('/api/v1/outlet-timings', { params });
  return res.data;
};

export const fetchNewOutletTimings = async (params = {}) => {
  const res = await api.get('/api/v1/outlet-timings/new', { params });
  return res.data;
};

export default api;
