import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import BookingSection from './BookingSection';
import BarberPanel from './BarberPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' o 'panel'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);

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

  const handleLogin = (e) => {
    e.preventDefault();
    // Clave genérica para el panel (puedes cambiarla aquí, ej: "barber123")
    if (passwordInput === '1234') {
      setIsAuthenticated(true);
      setErrorPassword(false);
      setPasswordInput('');
    } else {
      setErrorPassword(true);
    }
  };

  const handleNavClick = () => {
    if (currentView === 'home') {
      // Si quiere ir al panel y no está logueado, se queda en home pero muestra la vista de login o pasamos a panel pidiendo clave
      setCurrentView('panel');
    } else {
      setCurrentView('home');
      setIsAuthenticated(false); // Cierra sesión al salir por seguridad
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col justify-between">
      <div>
        <Navbar currentView={currentView} setCurrentView={handleNavClick} />
        
        {currentView === 'home' ? (
          <>
            <Hero onBookClick={() => {
              document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
            }} />
            <BookingSection onAddAppointment={addAppointment} />
          </>
        ) : (
          <div>
            {!isAuthenticated ? (
              <div className="py-20 px-6 max-w-md mx-auto text-center">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
                  <h2 className="text-xl font-bold mb-2 text-white">ACCESO RESTRINGIDO</h2>
                  <p className="text-zinc-400 text-xs mb-6">Ingresá la contraseña para acceder al Panel de Barberos.</p>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Contraseña (ej. 1234)"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm text-center focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    {errorPassword && (
                      <p className="text-rose-400 text-xs">Contraseña incorrecta. Intentá de nuevo.</p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-lg uppercase tracking-wider text-xs transition cursor-pointer"
                    >
                      Ingresar al Panel
                    </button>
                  </form>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition"
                  >
                    ← Volver a la web principal
                  </button>
                </div>
              </div>
            ) : (
              <BarberPanel appointments={appointments} onCancel={cancelAppointment} />
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 BARBER CLUB · TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </div>
  );
}
