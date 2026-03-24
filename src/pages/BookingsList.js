import React, { useMemo } from 'react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import './ListPages.css';

const BookingsList = () => {
    const bookings = useStore(state => state.bookings);
    const therapists = useStore(state => state.therapists);
    const services = useStore(state => state.services);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
    }, [bookings]);

    return (
        <div className="list-page-container animate-fade-in">
            <header className="list-page-header">
                <h1>All Bookings</h1>
                <p>Showing {bookings.length} total appointments</p>
            </header>

            <div className="list-table-wrapper glass">
                <table className="list-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Therapist</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBookings.length > 0 ? sortedBookings.map((booking, index) => {
                            const therapist = therapists.find(t => t.id === booking.therapistId);
                            const service = services.find(s => s.id === booking.serviceId);
                            const dateObj = new Date(`${booking.date}T${booking.time}`);

                            return (
                                <tr 
                                    key={booking.id} 
                                    style={{ animationDelay: `${index * 0.05}s` }} 
                                    className="stagger-item"
                                >
                                    <td>
                                        <div className="cell-datetime">
                                            <span className="cell-date">{format(dateObj, 'MMM dd, yyyy')}</span>
                                            <span className="cell-time">{booking.time}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cell-client">
                                            <span className="client-name">{booking.clientName}</span>
                                            <span className="client-phone">92214868</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="cell-service">{service?.name || 'Massage'}</span>
                                    </td>
                                    <td>
                                        <div className="cell-therapist">
                                            <div 
                                                className="therapist-dot" 
                                                style={{ backgroundColor: therapist?.gender === 'female' ? '#EC4899' : '#3B82F6' }}
                                            />
                                            {therapist?.firstName}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${booking.status || 'confirmed'}`}>
                                            {booking.status || 'Confirmed'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="5" className="empty-state-cell animate-fade-in">
                                    <div className="empty-state-content">
                                        <span className="empty-icon">📅</span>
                                        <p>No bookings found for the selected criteria.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingsList;
