import React from 'react';

export default function Hero({ onBookClick }) {
  return (
    <section className="relative px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase block mb-3">
          ✦ Cuidado. Precisión. Actitud.
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none mb-6">
          TU PRÓXIMO <br /><span className="italic font-normal text-amber-400">mejor corte.</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mb-8 leading-relaxed">
          Una experiencia precisa, sin esperas y hecha a tu medida. Elegí tu servicio y reservá en menos de un minuto.
        </p>
        <button
          onClick={onBookClick}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-4 rounded transition flex items-center space-x-2 tracking-wide uppercase text-xs"
        >
          <span>Reservar ahora</span>
          <span>→</span>
        </button>
      </div>

      <div className="relative h-72 md:h-96 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-6 left-6 z-10">
          <span className="text-amber-500 font-mono text-xs block mb-1">01 / EL RITUAL BARBER CLUB</span>
          <h3 className="text-white font-bold text-lg">RESERVAS ONLINE</h3>
        </div>
      </div>
    </section>
  );
}
