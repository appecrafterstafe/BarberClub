import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import BookingSection from './BookingSection';
import BarberPanel from './BarberPanel';
import { Key, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  
  // Estado para la contraseña del panel (por defecto "1234", pero se puede cambiar y se guarda)
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('barber_admin_pass') || '1234';
  });

  // Estados para cambiar la contraseña desde el panel
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('barber_appointments');
    return saved ? JSON.parse(saved) : [
      { id: 1, service: 'Corte clásico', price: 18000, date: '2026-07-10', time: '10:30', client: 'Martín García', phone: '+54 9 11 2345-6789', barber: 'Carlos', status: 'Confirmado' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('barber_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('barber_admin_pass', adminPassword);
  }, [adminPassword]);

  const addAppointment = (newApp) => {
    setAppointments([ { id: Date.now(), ...newApp, status: 'Confirmado' }, ...appointments ]);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.map(app => app.id === id ? { ...app, status: 'Cancelado' } : app));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setErrorPassword(false);
      setPasswordInput('');
    } else {
      setErrorPassword(true);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (currentPassInput !== adminPassword) {
      setPassSuccess('Error: La contraseña actual es incorrecta.');
      return;
    }
    if (!newPassInput || newPassInput.length < 4) {
      setPassSuccess('Error: La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    setAdminPassword(newPassInput);
    setCurrentPassInput('');
    setNewPassInput('');
    setPassSuccess('¡Contraseña actualizada con éxito!');
    setTimeout(() => setPassSuccess(''), 4000);
  };

  const handleNavClick = () => {
    if (currentView === 'home') {
      setCurrentView('panel');
    } else {
      setCurrentView('home');
      setIsAuthenticated(false);
      setShowChangePass(false);
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
                      placeholder="Contraseña (por defecto 1234)"
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
              <div className="py-8 px-6 max-w-5xl mx-auto space-y-6">
                {/* Botón para cambiar contraseña */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowChangePass(!showChangePass)}
                    className="flex items-center space-x-2 text-xs bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-300 px-4 py-2 rounded-lg transition"
                  >
                    <Key size={14} className="text-amber-500" />
                    <span>{showChangePass ? 'Ocultar ajuste de clave' : 'Cambiar contraseña de acceso'}</span>
                  </button>
                </div>

                {/* Formulario desplegable para cambiar clave */}
                {showChangePass && (
                  <div className="bg-zinc-900 border border-amber-500/40 p-6 rounded-2xl max-w-md ml-auto space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <ShieldCheck size={16} className="text-amber-500" />
                      <span>Modificar Contraseña de Admin</span>
                    </h3>
                    {passSuccess && (
                      <p className={`text-xs p-2 rounded ${passSuccess.includes('Error') ? 'bg-rose-950/50 text-rose-300 border border-rose-800' : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'}`}>
                        {passSuccess}
                      </p>
                    )}
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Contraseña actual</label>
                        <input
                          type="password"
                          value={currentPassInput}
                          onChange={(e) => setCurrentPassInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">Nueva contraseña</label>
                        <input
                          type="password"
                          value={newPassInput}
                          onChange={(e) => setNewPassInput(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded uppercase tracking-wider text-xs transition cursor-pointer"
                      >
                        Guardar nueva contraseña
                      </button>
                    </form>
                  </div>
                )}

                {/* Panel de turnos habitual */}
                <BarberPanel appointments={appointments} onCancel={cancelAppointment} />
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 BARBER CLUB · Appe Crafter STAFE · TODOS LOS DERECHOS RESERVADOS</p>
      </footer>
    </div>
  );
}
