import React from 'react';
import { Calendar, User, Clock, Phone, XCircle } from 'lucide-react';

export default function BarberPanel({ appointments, onCancel }) {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase block mb-1">Área Administrativa</span>
          <h2 className="text-3xl font-bold text-white">Panel de Barberos</h2>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs text-zinc-400">
          Turnos registrados: <span className="text-amber-400 font-bold">{appointments.filter(a => a.status === 'Confirmado').length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-12">No hay turnos registrados todavía.</p>
        ) : (
          appointments.map((app) => (
            <div
              key={app.id}
              className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                app.status === 'Cancelado'
                  ? 'bg-zinc-950/40 border-zinc-900 opacity-50 line-through'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base">{app.client}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {app.service}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center space-x-1"><Calendar size={13} className="text-amber-500" /><span>{app.date}</span></span>
                  <span className="flex items-center space-x-1"><Clock size={13} className="text-amber-500" /><span>{app.time} hs</span></span>
                  <span className="flex items-center space-x-1"><Phone size={13} className="text-amber-500" /><span>{app.phone}</span></span>
                  <span className="flex items-center space-x-1"><User size={13} className="text-amber-500" /><span>Barbero: {app.barber}</span></span>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
                <span className="font-mono font-bold text-amber-400 text-base">${Number(app.price || 0).toLocaleString()}</span>
                {app.status === 'Confirmado' && (
                  <button
                    onClick={() => onCancel(app.id)}
                    className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/50 bg-rose-950/20 px-3 py-1.5 rounded transition cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
