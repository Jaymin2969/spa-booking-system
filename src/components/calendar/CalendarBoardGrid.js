import React, { useRef, useState, useEffect } from 'react';
import { List } from 'react-window';
import useStore from '../../store/useStore';
import { logger } from '../../utils/logger';
import './calendar.css';

const START_HOUR = 9;
const END_HOUR = 20;
const INTERVAL_MINS = 15;
const SLOT_HEIGHT = 30; // px
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * (60 / INTERVAL_MINS);
const TOTAL_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT;
const COLUMN_WIDTH = 200;

const TimeAxis = () => {
  const labels = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    const isPM = hour >= 12;
    const hour12 = hour > 12 ? hour - 12 : hour;
    const ampm = isPM ? 'PM' : 'AM';
    labels.push(
      <div 
        key={hour} 
        className="time-label-container" 
        style={{ top: (hour - START_HOUR) * 4 * SLOT_HEIGHT }}
      >
        <div className="time-label-main">{`${hour12.toString().padStart(2, '0')}.00`}</div>
        <div className="time-label-ampm">{ampm}</div>
        <div className="time-label-sub">23F 25M</div>
      </div>
    );
  }
  return <div className="time-axis" style={{ height: TOTAL_HEIGHT }}>{labels}</div>;
};

const GridLines = () => {
  const lines = [];
  for (let i = 0; i < TOTAL_SLOTS; i++) {
    const isHour = i % 4 === 0;
    lines.push(
      <div 
        key={i} 
        className={`grid-bg-line ${isHour ? 'hour-line' : ''}`}
        style={{ top: i * SLOT_HEIGHT, height: SLOT_HEIGHT }}
      />
    );
  }
  return <>{lines}</>;
};

const BookingCard = ({ booking, onClick }) => {
  const storeServices = useStore((state) => state.services) || [];
  const storeRooms = useStore((state) => state.rooms) || [];

  const [hour, min] = booking.time.split(':').map(Number);
  const startSlot = ((hour - START_HOUR) * 60 + min) / INTERVAL_MINS;
  const spanSlots = booking.duration / INTERVAL_MINS;
  
  const top = startSlot * SLOT_HEIGHT;
  const height = spanSlots * SLOT_HEIGHT;

  const service = storeServices.find(s => s.id === booking.serviceId);
  const serviceName = service?.name || 'Service';
  const room = storeRooms.find(r => r.id === booking.roomId)?.name || 'Room';

  // Coloring based on service type (mock logic)
  let cardColor = '#BFDBFE'; // Light Blue
  let borderColor = '#3B82F6';
  if (serviceName.includes('Massage') || serviceName.includes('Slimming')) {
    cardColor = '#FCE7F3'; // Light Pink
    borderColor = '#EC4899';
  }
  if (serviceName.includes('Acupressure') || serviceName.includes('Tui Na')) {
    cardColor = '#CFE2FF';
    borderColor = '#0D6EFD';
  }

  return (
    <div 
      className="booking-card"
      style={{ top, height, backgroundColor: cardColor, borderColor }}
      onClick={(e) => { e.stopPropagation(); onClick(booking); }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('bookingId', booking.id);
      }}
    >
      <div className="booking-card-header">
        <span className="booking-service">{booking.duration} Min {serviceName}</span>
      </div>
      <div className="booking-client-info">
        <span className="booking-phone">92214868</span>
        <span className="booking-client-name">{booking.clientName}</span>
      </div>
      <div className="booking-icons">
        <span className="icon-badge icon-t">T</span>
        <span className="icon-badge icon-r">R</span>
        <span className="icon-extra">📅</span>
      </div>
    </div>
  );
};

export const CalendarBoardGrid = () => {
  const therapists = useStore((state) => state.therapists);
  const bookings = useStore((state) => state.bookings);
  const openPanel = useStore((state) => state.openPanel);
  const headerScrollRef = useRef(null);
  
  const [containerWidth, setContainerWidth] = useState(1000);

  // Measure container for react-window
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth - 80); // Minus time axis
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth - 80);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = ({ scrollOffset }) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollOffset;
    }
  };

  const [inProgressSlot, setInProgressSlot] = useState(null); // { therapistId, time }

  const handleColumnClick = (therapistId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const slotIndex = Math.max(0, Math.floor(y / SLOT_HEIGHT));
    const hour = START_HOUR + Math.floor(slotIndex / 4);
    const min = (slotIndex % 4) * INTERVAL_MINS;
    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    setInProgressSlot({ therapistId, time: timeStr });
    openPanel({ therapistId, time: timeStr, duration: 60 });
  };

  const Column = ({ index, style }) => {
    const therapist = therapists && therapists[index];
    if (!therapist) return <div style={style} />;
    
    const columnBookings = (bookings || []).filter(b => b.therapistId === therapist.id);
    const isSlotHolding = inProgressSlot && inProgressSlot.therapistId === therapist.id;

    return (
      <div 
        className="therapist-column" 
        style={style}
        onClick={(e) => handleColumnClick(therapist.id, e)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const bookingId = e.dataTransfer.getData('bookingId');
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const slotIndex = Math.max(0, Math.floor(y / SLOT_HEIGHT));
          const hour = START_HOUR + Math.floor(slotIndex / 4);
          const min = (slotIndex % 4) * INTERVAL_MINS;
          const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
          
          const updateBooking = useStore.getState().updateBooking;
          const booking = useStore.getState().bookings.find(b => b.id === bookingId);
          if(booking) {
            updateBooking(bookingId, { ...booking, therapistId: therapist.id, time: timeStr });
            logger.action(`Rescheduled booking ${bookingId} to Therapist ${therapist.id} at ${timeStr}`);
          }
        }}
      >
        <GridLines />
        {isSlotHolding && (
          <div 
            className="booking-progress-block"
            style={{ 
              top: (((parseInt(inProgressSlot.time.split(':')[0]) - START_HOUR) * 60 + parseInt(inProgressSlot.time.split(':')[1])) / INTERVAL_MINS) * SLOT_HEIGHT,
              height: 4 * SLOT_HEIGHT // Default 60m
            }}
          >
            Booking in progress
          </div>
        )}
        {columnBookings.map(b => (
          <BookingCard key={b.id} booking={b} onClick={(b) => openPanel(b)} />
        ))}
      </div>
    );
  };

  if(!therapists || !therapists.length) return (
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <h3>Initializing Calendar Data...</h3>
    </div>
  );

  return (
    <div className="calendar-container" ref={containerRef}>
      <div className="calendar-header">
        <div className="time-axis-header"></div>
        <div className="therapist-headers" ref={headerScrollRef}>
          <div style={{ display: 'flex', width: therapists.length * COLUMN_WIDTH }}>
            {therapists.map((t, i) => {
              const themeColor = t.gender === 'female' ? '#EC4899' : '#3B82F6';
              const genderLabel = t.gender === 'female' ? 'Female' : 'Male';
              return (
                <div key={t.id} className="therapist-header-cell" style={{ width: COLUMN_WIDTH }}>
                  <div className="therapist-header-top">
                    <div className="therapist-id-circle" style={{ backgroundColor: themeColor }}>
                      {i + 1}
                    </div>
                    <span className="therapist-name">{t.firstName}</span>
                  </div>
                  <span className="therapist-gender" style={{ color: '#6b7280', fontSize: '10px' }}>
                    {genderLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="calendar-body-wrapper">
        <TimeAxis />
        {containerWidth > 0 && (
          <List
            layout="horizontal"
            width={containerWidth}
            height={TOTAL_HEIGHT}
            itemCount={therapists.length}
            itemSize={COLUMN_WIDTH}
            onScroll={handleScroll}
            style={{ overflowY: 'hidden' }}
          >
            {Column}
          </List>
        )}
      </div>
    </div>
  );
};
