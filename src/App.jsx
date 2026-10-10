import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import BookingSection from './BookingSection';
import BarberPanel from './BarberPanel';
import { Key, ShieldCheck, Loader2 } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuDLwzYOlNXlnb85bKUfwETQ06WOVLkBNOpZmY1KhiHQSWcC3DOKGXla0ciwFw9yKI/exec';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ahora solo guardamos si existe una contraseña en el backend (boolean)
  const [hasAdminPassword, setHasAdminPassword] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      setAppointments(Array.isArray(data.appointments) ? data.appointments.reverse() : []);
      setHasAdminPassword(Boolean(data.adminPasswordExists));
    } catch (error) {
      console.error('Error al sincronizar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addAppointment = async (newApp) => {
    try {
      setLoading(true);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...newApp })
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok || body.ok === false) {
        throw new Error(body.message || 'Error del servidor');
      }

      setTimeout(async () => {
        await fetchData();
        alert('¡Turno reservado con éxito!');
      }, 800);
    } catch (error) {
      console.error('Error al guardar turno:', error);
      alert('No se pudo guardar el turno. Verificá la conexión o la configuración del script en Google.');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', id: id })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) throw new Error(body.message || 'Error al cancelar');

      setTimeout(fetchData, 800);
    } catch (error) {
      console.error('Error al cancelar turno:', error);
      alert('No se pudo cancelar el turno. Verificá la conexión o la configuración del script en Google.');
    } finally {
      setLoading(false);
    }
  };

  // En lugar de exponer la contraseña, validamos en el servidor
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkPassword', password: passwordInput })
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setIsAuthenticated(true);
        setErrorPassword(false);
        setPasswordInput('');
        fetchData();
      } else {
        setErrorPassword(true);
      }
    } catch (error) {
      console.error('Error al validar contraseña:', error);
      setErrorPassword(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassInput || newPassInput.length < 4) {
      setPassSuccess('Error: La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', currentPassword: currentPassInput, newPassword: newPassInput })
      });
      const body = await res.json().catch(() => ({}));

      if (res.ok && body.ok) {
        setPassSuccess('¡Contraseña actualizada en la nube con éxito!');
        setCurrentPassInput('');
        setNewPassInput('');
        setTimeout(() => setPassSuccess(''), 4000);
        setTimeout(fetchData, 800);
      } else {
        setPassSuccess(body.message || 'Error al actualizar contraseña.');
      }
    } catch (error) {
      setPassSuccess('Error al actualizar contraseña.');
    } finally {
      setLoading(false);
    }
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
            <BookingSection onAddAppointment={addAppointment} appointments={appointments} />
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
                      placeholder={hasAdminPassword ? "Contraseña de admin" : "No hay contraseña configurada"}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm text-center focus:outline-none focus:border-amber-500"
                      autoFocus
                      disabled={loading}
                    />
                    {errorPassword && (
                      <p className="text-rose-400 text-xs">Contraseña incorrecta. Intentá de nuevo.</p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 rounded-lg uppercase tracking-wider text-xs transition cursor-pointer"
                      disabled={loading}
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
                <div className="flex justify-between items-center">
                  {loading && (
                    <div className="flex items-center space-x-2 text-xs text-amber-400">
                      <Loader2 className="animate-spin" size={14} />
                      <span>Sincronizando con Google Sheets...</span>
                    </div>
                  )}
                  <div className="ml-auto">
                    <button
                      onClick={() => setShowChangePass(!showChangePass)}
                      className="flex items-center space-x-2 text-xs bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-300 px-4 py-2 rounded-lg transition"
                    >
                      <Key size={14} className="text-amber-500" />
                      <span>{showChangePass ? 'Ocultar ajuste de clave' : 'Cambiar contraseña de acceso'}</span>
                    </button>
                  </div>
                </div>

                {showChangePass && (
                  <div className="bg-zinc-900 border border-amber-500/40 p-6 rounded-2xl max-w-md ml-auto space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                      <ShieldCheck size={16} className="text-amber-500" />
                      <span>Modificar Contraseña de Admin en la Nube</span>
                    </h3>
                    {passSuccess && (
                      <p className={`text-xs p-2 rounded ${passSuccess.includes('Error') ? 'bg-rose-950/50 text-rose-300 border border-rose-800' : 'bg-emerald-950/50 text-emerald-300 border border-emerald-700'}`}>
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
                          placeholder={hasAdminPassword ? 'Contraseña actual' : 'No hay contraseña actual (crear nueva)'}
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

                <BarberPanel appointments={appointments} onCancel={cancelAppointment} />
              </div>
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
