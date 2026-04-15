
import React from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Play, RotateCcw, Calendar } from 'lucide-react';

export function SimulationForm() {
  const { params, setParams, runSimulation, scenarios, setScenario, isSimulating } = useSimulationStore();

  return (
    <div className="w-80 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col gap-8 h-fit sticky top-24">
      <div>
        <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Configuración de Simulación</h2>
        
        <div className="space-y-5">
          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-2">Presintonía (Día de la semana)</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none hover:bg-zinc-900 transition-colors cursor-pointer"
              onChange={(e) => setScenario(e.target.value)}
            >
              <option value="">Seleccionar escenario...</option>
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-2">λ (Llegadas/H)</label>
              <input 
                type="number"
                value={params.lambda}
                onChange={(e) => setParams({ lambda: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 text-xs font-medium block mb-2">μ (Atención/H)</label>
              <input 
                type="number"
                value={params.mu}
                onChange={(e) => setParams({ mu: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-2">s (Personal/Cajeros)</label>
            <input 
              type="number"
              value={params.s}
              onChange={(e) => setParams({ s: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-2">Tiempo Simulación (min)</label>
            <input 
              type="number"
              value={params.duration}
              onChange={(e) => setParams({ duration: Number(e.target.value) })}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSimulating ? (
          <RotateCcw className="h-5 w-5 animate-spin" />
        ) : (
          <Play className="h-5 w-5 fill-current" />
        )}
        <span>{isSimulating ? 'Simulando...' : 'Iniciar Simulación'}</span>
      </button>

      <p className="text-zinc-600 text-[10px] text-center px-4 leading-relaxed italic">
        * Basado en el modelo de teoría de colas M/M/s (Erlang-C) y Simulación de Eventos Discretos.
      </p>
    </div>
  );
}
