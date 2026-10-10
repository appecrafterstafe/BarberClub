import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const SERVICES = [
  { id: 1, name: 'Corte clásico', desc: 'Precisión, tijera y máquina', duration: 45, price: 18000 },
  { id: 2, name: 'Barba premium', desc: 'Perfilado, navaja y toallas calientes', duration: 30, price: 12000 },
  { id: 3, name: 'Corte + barba', desc: 'El ritual completo', duration: 60, price: 27000 },
];

const TIMES = ['09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30'];

export default function BookingSection({ onAddAppointment, appointments = [] }) {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [barber, setBarber] = useState('Carlos');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Por favor completá tu nombre y WhatsApp');
      return;
    }

    const [year, month, day] = selectedDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    onAddAppointment({
      service: selectedService.name,
      price: selectedService.price,
      date: formattedDate,
      time: `${selectedTime} hs`,
      client: clientName,
      phone: clientPhone,
      barber: barber,
      duration: selectedService.duration
    });

    setSuccess(true);
    setClientName('');
    setClientPhone('');
    setTimeout(() => setSuccess(false), 4000);
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const clean = String(timeStr).replace(/hs/gi, '').trim();
    const [h, m] = clean.split(':').map(Number);
    return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  };

  const isTimeDisabled = (timeStr) => {
    const slotStart = timeToMinutes(timeStr);
    const serviceDuration = selectedService.duration || 30;
    const slotEnd = slotStart + serviceDuration;

    const [year, month, day] = selectedDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const conflictingAppointments = appointments.filter((app) => {
      const isSameDate = app.date === formattedDate;
      const isSameBarber = barber === 'Cualquiera' || app.barber === barber;
      return isSameDate && isSameBarber;
    });

    for (let app of conflictingAppointments) {
      const appStart = timeToMinutes(app.time);
      const appDuration = Number(app.duration || 45);
      const appEnd = appStart + appDuration;

      if (slotStart < appEnd && slotEnd > appStart) {
        return true;
      }
    }
    return false;
  };

  return (
    <section id="booking-section" className="py-16 px-6 max-w-4xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-white">ENCONTRÁ TU MOMENTO.</h2>
        <p className="text-zinc-400 text-xs mb-8">Seleccioná los detalles de tu próximo turno.</p>

        {success && (
          <div className="mb-6 p-4 bg-emerald-950/50 border border-emerald-600/50 text-emerald-300 rounded-lg flex items-center space-x-3 text-sm">
            <CheckCircle2 size={20} />
            <span>¡Turno reservado con éxito! Ya aparece reflejado en el Panel de barberos.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">1. Seleccioná el servicio</label>
            <div className="grid md:grid-cols-3 gap-3">
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedService.id === s.id
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <p className="font-bold text-sm text-white mb-1">{s.name}</p>
                  <p className="text-[11px] mb-3 text-zinc-400">{s.desc}</p>
                  <p className="text-amber-400 font-mono font-bold text-sm">${s.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">2. Fecha del turno</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">3. Barbero preferido</label>
              <select
                value={barber}
                onChange={(e) => setBarber(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Barbero1">Barb1 (Barber)</option>
                <option value="Barbero2">Barb2 (Barber)</option>
                <option value="Cualquiera">Mejor disponible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">4. Horario disponible</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {TIMES.map((t) => {
                const disabled = isTimeDisabled(t);
                return (
                  <button
                    type="button"
                    key={t}
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedTime(t)}
                    className={`py-2 text-xs font-mono rounded border transition ${
                      disabled
                        ? 'bg-zinc-900 border-zinc-900 text-zinc-700 cursor-not-allowed opacity-40 line-through'
                        : selectedTime === t
                        ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">Tu Nombre</label>
              <input
                type="text"
                placeholder="Ej. Martín García"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">WhatsApp</label>
              <input
                type="text"
                placeholder="+54 9 11..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-4 rounded-xl uppercase tracking-wider text-xs transition shadow-lg mt-4 cursor-pointer"
          >
            Confirmar mi turno
          </button>
        </form>
      </div>
    </section>
  );
}
