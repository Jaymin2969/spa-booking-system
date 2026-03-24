export const generateMockData = () => {
  const therapists = [];
  const rooms = [];
  const services = [
    { id: 's1', name: 'Swedish Massage' },
    { id: 's2', name: 'Deep Tissue Massage' },
    { id: 's3', name: 'Hot Stone Therapy' },
    { id: 's4', name: 'Aromatherapy' }
  ];

  const figmaTherapists = [
    { name: 'Chacha', gender: 'female' },
    { name: 'James', gender: 'male' },
    { name: 'Laksa', gender: 'female' },
    { name: 'Lily', gender: 'female' },
    { name: 'Mozza', gender: 'female' },
    { name: 'Nina', gender: 'female' },
    { name: 'Philip', gender: 'male' },
    { name: 'Sakura', gender: 'female' },
    { name: 'Summer', gender: 'female' },
    { name: 'Yashika', gender: 'female' },
    { name: 'Glory', gender: 'female' }
  ];

  for (let i = 1; i <= 200; i++) {
    const figmaT = figmaTherapists[(i - 1) % figmaTherapists.length];
    therapists.push({
      id: `t${i}`,
      firstName: figmaT.name,
      lastName: i > figmaTherapists.length ? `(${i})` : '',
      gender: figmaT.gender,
    });
  }

  for (let i = 1; i <= 20; i++) {
    rooms.push({
      id: `r${i}`,
      name: `Room ${i}`
    });
  }

  const bookings = [];
  const targetDate = new Date().toISOString().split('T')[0];

  for (let i = 1; i <= 2000; i++) {
    // Random therapist
    const tId = therapists[Math.floor(Math.random() * therapists.length)].id;
    // Random hour between 9 and 20 (9 AM to 8 PM)
    const hour = Math.floor(Math.random() * 12) + 9;
    const min = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    // Random duration: 60, 90, 120
    const duration = [60, 90, 120][Math.floor(Math.random() * 3)];
    
    bookings.push({
      id: `b${i}`,
      therapistId: tId,
      roomId: rooms[Math.floor(Math.random() * rooms.length)].id,
      serviceId: services[Math.floor(Math.random() * services.length)].id,
      clientName: `Client ${i}`,
      date: targetDate,
      time: timeStr,
      duration: duration,
      requestType: 'any',
      status: 'confirmed'
    });
  }

  return { therapists, rooms, services, bookings };
};
