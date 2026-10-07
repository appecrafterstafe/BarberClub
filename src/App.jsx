import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import BookingSection from './BookingSection';
import BarberPanel from './BarberPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' o 'panel'
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('barber_appointments');
    return saved ? JSON.parse(saved) : [
      { id: 1, service: 'Corte clásico', price: 18000, date: '2026-07-10', time: '10:30', client: 'Martín García', phone: '+54 9 11 2345-6789', barber: 'Carlos', status: 'Confirmado' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('barber_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (newApp) => {
    setAppointments([ { id: Date.now(), ...newApp, status: 'Confirmado' }, ...appointments ]);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Cancelado' } : app));
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col justify-between">
      <div>
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        {currentView === 'home' ? (
          <>
            <Hero onBookClick={() => {
              document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
            }} />
            <BookingSection onAddAppointment={addAppointment} />
          </>
        ) : (
          <BarberPanel appointments={appointments} onCancel={cancelAppointment} />
        )}
      </div>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 BARBER CLUB · TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </div>
  );
}
