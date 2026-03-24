import React, { useState } from 'react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import useStore from '../../store/useStore';
import './booking.css';

export const BookingForm = ({ defaultValues, onSubmit, onCancel }) => {
  const therapists = useStore((state) => state.therapists) || [];
  const services = useStore((state) => state.services) || [];
  const rooms = useStore((state) => state.rooms) || [];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    serviceId: '',
    therapistId: '',
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    requestType: '',
    notes: '',
    ...defaultValues
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="booking-form-v2">
      <div className="outlet-info">
        <span className="label">Outlet</span>
        <span className="value">Liat Towers</span>
      </div>

      <div className="datetime-row">
        <div className="datetime-item">
          <span className="label">On</span>
          <div className="datetime-value">
            <span className="icon">📅</span>
            <span className="value">Tue, Aug 8</span>
          </div>
        </div>
        <div className="datetime-item">
          <span className="label">At</span>
          <div className="datetime-value">
            <span className="icon">🕒</span>
            <span className="value">09:30 PM</span>
          </div>
        </div>
      </div>

      <div className="client-search-section">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            placeholder="Search or create client" 
            className="client-search-input"
          />
          <button className="add-client-btn">+</button>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <h4>Booking Details</h4>
        <div className="form-grid">
          <Select 
            label="Service" 
            name="serviceId" 
            value={formData.serviceId} 
            onChange={handleChange} 
            options={services.map(s => ({ value: s.id, label: s.name }))} 
            required 
          />
          <Select 
            label="Therapist" 
            name="therapistId" 
            value={formData.therapistId} 
            onChange={handleChange} 
            options={therapists.map(t => ({ value: t.id, label: `${t.firstName}` }))} 
            required 
          />
        </div>
        
        <div className="form-grid">
          <Select 
            label="Room" 
            name="roomId" 
            value={formData.roomId} 
            onChange={handleChange} 
            options={rooms.map(r => ({ value: r.id, label: r.name }))} 
            required 
          />
          <Select 
            label="Duration (mins)" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            options={[
              {value: '30', label: '30 mins'},
              {value: '60', label: '60 mins'},
              {value: '90', label: '90 mins'},
              {value: '120', label: '120 mins'}
            ]} 
            required 
          />
        </div>

        <div className="input-group">
          <label className="input-label">Notes</label>
          <textarea 
            className="input-field" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            placeholder="Any special requests..."
          />
        </div>

        <div className="booking-form-actions">
          <Button type="submit" variant="primary" style={{ width: '100%' }}>Complete Booking</Button>
        </div>
      </form>
    </div>
  );
};
