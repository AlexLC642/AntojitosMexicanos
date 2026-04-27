
'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Play, Save, Trash2, Users, Clock, Timer, Percent, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export function TripleComparison() {
  const { 
    tripleScenarios, 
    updateTripleScenario, 
    runTripleSimulation, 
    isTripleSimulating,
    scenarios,
    saveTripleScenario
  } = useSimulationStore();
  
  const theme = useTheme();
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleSave = async (index: number) => {
    const name = prompt('Nombre para este escenario:');
    if (name) {
      setSavingIndex(index);
      await saveTripleScenario(index, name);
      setSavingIndex(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Analizador Triple</h2>
          <p className="text-zinc-500 text-sm">Compara 3 configuraciones distintas del mismo día o turno.</p>
        </div>
        <button
          onClick={runTripleSimulation}
          disabled={isTripleSimulating}
          className={cn(
            "px-8 py-4 rounded-2xl flex items-center gap-3 text-white font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
            theme.bgPrimary
          )}
        >
          <Play className={cn("h-5 w-5 fill-current", isTripleSimulating && "animate-spin")} />
          {isTripleSimulating ? 'Simulando...' : 'Simular Todo'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tripleScenarios.map((slot, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-red-600 transition-colors" />
            
            <div className="flex justify-between items-center">
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-zinc-700">
                Espacio {idx + 1}
              </span>
              <button 
                onClick={() => handleSave(idx)}
                disabled={savingIndex === idx}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>

            {/* Selector de Pre-sintonía */}
            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">Cargar Escenario</label>
              <select 
                onChange={(e) => {
                  const s = scenarios.find(s => s.id === e.target.value);
                  if (s) updateTripleScenario(idx, s.params);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-medium focus:ring-2 focus:ring-red-600 outline-none appearance-none"
              >
                <option value="">Manual / Personalizado</option>
                {scenarios.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Inputs Manuales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">λ (Llegada/h)</label>
                <input 
                  type="number"
                  value={slot.params.lambda}
                  onChange={(e) => updateTripleScenario(idx, { lambda: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">μ (Servicio/h)</label>
                <input 
                  type="number"
                  value={slot.params.mu}
                  onChange={(e) => updateTripleScenario(idx, { mu: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-zinc-500 text-[10px] font-bold uppercase ml-1">Personal (Servidores)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => updateTripleScenario(idx, { s: val })}
                    className={cn(
                      "flex-1 py-2 rounded-lg border text-sm font-bold transition-all",
                      slot.params.s === val 
                        ? "bg-red-600 border-red-500 text-white" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Resultados */}
            <div className="mt-4 flex-1">
              {slot.result ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-red-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Wq (Cola)</span>
                      </div>
                      <span className={cn(
                        "text-xl font-black",
                        slot.result.wq > 10 ? "text-red-500" : "text-green-500"
                      )}>
                        {slot.result.wq.toFixed(1)}m
                      </span>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="h-3 w-3 text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">Uso</span>
                      </div>
                      <span className="text-xl font-black text-white">
                        {(slot.result.utilization * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold text-zinc-500 uppercase">Balance de Carga</span>
                       <span className="text-[10px] font-black text-white">
                          {slot.result.utilization > 0.9 ? 'CRÍTICO' : slot.result.utilization > 0.7 ? 'ALTO' : 'ÓPTIMO'}
                       </span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all duration-1000",
                          slot.result.utilization > 0.9 ? "bg-red-600" : "bg-green-500"
                        )}
                        style={{ width: `${Math.min(100, slot.result.utilization * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
                  <Timer className="h-8 w-8 text-zinc-700 mb-2" />
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-center px-4">
                    Esperando simulación
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
