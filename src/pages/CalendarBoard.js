import React from 'react';
import useStore from '../store/useStore';
import { CalendarBoardGrid } from '../components/calendar/CalendarBoardGrid';
import { SidePanel } from '../components/ui/SidePanel';
import { BookingForm } from '../components/bookings/BookingForm';
import { Button } from '../components/ui/Button';
import { logger } from '../utils/logger';

const CalendarBoard = () => {
  const addBooking = useStore(state => state.addBooking);
  const updateBooking = useStore(state => state.updateBooking);
  const removeBooking = useStore(state => state.removeBooking);
  const isPanelOpen = useStore(state => state.isPanelOpen);
  const closePanel = useStore(state => state.closePanel);
  const selectedBooking = useStore(state => state.selectedBooking);

  const handleSaveBooking = (formData) => {
    if (selectedBooking) {
      // Editing
      updateBooking(selectedBooking.id, { ...selectedBooking, ...formData });
      logger.action(`Updated booking ${selectedBooking.id}`);
    } else {
      // Creating
      const newBooking = { id: `b_${Date.now()}`, ...formData };
      addBooking(newBooking);
      logger.action(`Created new booking ${newBooking.id}`);
    }
    closePanel();
  };

  const handleDelete = () => {
    if (selectedBooking && window.confirm('Are you sure you want to cancel this booking?')) {
      removeBooking(selectedBooking.id);
      logger.action(`Cancelled booking ${selectedBooking.id}`);
      closePanel();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CalendarBoardGrid />
      
      <SidePanel 
        title={selectedBooking ? 'Edit Booking' : 'New Booking'}
      >
        {isPanelOpen && (
          <BookingForm 
            defaultValues={selectedBooking || {}} 
            onSubmit={handleSaveBooking} 
            onCancel={closePanel}
          />
        )}
        
        {selectedBooking && selectedBooking.id && (
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <Button variant="danger" onClick={handleDelete} style={{ width: '100%' }}>
              Cancel Selection (Delete Booking)
            </Button>
          </div>
        )}
      </SidePanel>
    </div>
  );
};

export default CalendarBoard;
