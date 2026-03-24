import React from 'react';
import useStore from '../store/useStore';
import './ListPages.css';

const TherapistsList = () => {
    const therapists = useStore(state => state.therapists);
    const bookings = useStore(state => state.bookings);

    return (
        <div className="list-page-container animate-fade-in">
            <header className="list-page-header">
                <h1>Our Therapists</h1>
                <p>Showing {therapists.length} specialized professionals</p>
            </header>

            <div className="therapists-grid">
                {therapists.length > 0 ? therapists.map((therapist, index) => {
                    const therapistBookings = bookings.filter(b => b.therapistId === therapist.id);
                    const themeColor = therapist.gender === 'female' ? '#EC4899' : '#3B82F6';

                    return (
                        <div 
                            key={therapist.id} 
                            style={{ animationDelay: `${index * 0.03}s` }} 
                            className="therapist-card glass stagger-item-slide"
                        >
                            <div className="therapist-card-header">
                                <div className="therapist-avatar" style={{ backgroundColor: themeColor }}>
                                    {therapist.firstName.charAt(0)}
                                </div>
                                <div className="therapist-info">
                                    <h3>{therapist.firstName} {therapist.lastName}</h3>
                                    <span className="therapist-gender" style={{ color: themeColor }}>
                                        {therapist.gender === 'female' ? 'Female' : 'Male'}
                                    </span>
                                </div>
                            </div>
                            <div className="therapist-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{therapistBookings.length}</span>
                                    <span className="stat-label">Bookings</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">4.9/5</span>
                                    <span className="stat-label">Rating</span>
                                </div>
                            </div>
                            <div className="therapist-footer">
                                <span className={`status-pill ${therapistBookings.length < 5 ? 'available' : 'busy'}`}>
                                    {therapistBookings.length < 5 ? 'Available' : 'Limited availability'}
                                </span>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="empty-state-container animate-fade-in">
                        <p>Loading therapists list...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TherapistsList;
