
'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Play, Save, Clock, Timer, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { HourlyBreakdown } from './HourlyBreakdown';

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
  const [activeTab, setActiveTab] = useState<number>(0);

  const calculateEndTime = (startHour: string, period: string, durationMin: number) => {
    let hour = parseInt(startHour);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const startMinutes = hour * 60;
    const endMinutesTotal = startMinutes + durationMin;
    
    let endHour = Math.floor((endMinutesTotal / 60) % 24);
    const endMin = Math.floor(endMinutesTotal % 60);
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    
    if (endHour > 12) endHour -= 12;
    if (endHour === 0) endHour = 12;
    
    return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')} ${endPeriod}`;
  };

  const handleSave = async (index: number) => {
    const slot = tripleScenarios[index];
    const timeStr = `${slot.params.hour || '08'}:00 ${slot.params.period || 'AM'}`;
    const defaultName = [
      slot.params.day, 
      timeStr, 
      slot.params.customLabel
    ].filter(Boolean).join(' | ') || 'Escenario Nuevo';

    const name = prompt('Confirmar nombre para este escenario:', defaultName);
    if (name) {
      setSavingIndex(index);
      await saveTripleScenario(index, name);
      setSavingIndex(null);
    }
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Comparador de Escenarios Premium</h2>
          <p className="text-zinc-500 text-sm">Configura hasta 3 situaciones y analiza el detalle abajo.</p>
        </div>
        <button
          onClick={runTripleSimulation}
          disabled={isTripleSimulating}
          className={cn(
            "px-8 py-4 rounded-2xl flex items-center gap-3 text-white font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50",
            theme.bgPrimary,
            theme.glowPrimary
          )}
        >
          <Play className={cn("h-5 w-5 fill-current", isTripleSimulating && "animate-spin")} />
          {isTripleSimulating ? 'Simular Todo' : 'Simular Todo'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tripleScenarios.map((slot, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className={cn(
               "absolute top-0 left-0 w-1 h-full transition-colors",
               activeTab === idx ? "bg-red-600" : "bg-zinc-800 group-hover:bg-zinc-700"
            )} />
            
            <div className="flex justify-between items-center">
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-zinc-700">
                Escenario {idx + 1}
              </span>
              <button 
                onClick={() => handleSave(idx)}
                disabled={savingIndex === idx}
                className="bg-zinc-800 p-2 rounded-lg text-zinc-500 hover:text-white transition-colors border border-zinc-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>

            {/* Clasificación de Escenario */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">Día de la Semana</label>
                <select 
                  value={slot.params.day || ''}
                  onChange={(e) => updateTripleScenario(idx, { day: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-red-600 outline-none appearance-none"
                >
                  <option value="">Día...</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">Horario (Inicio)</label>
                <div className="flex gap-1">
                  <select 
                    value={slot.params.hour || '08'}
                    onChange={(e) => updateTripleScenario(idx, { hour: e.target.value })}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    {hours.map(h => <option key={h} value={h}>{h}:00</option>)}
                  </select>
                  <select 
                    value={slot.params.period || 'AM'}
                    onChange={(e) => updateTripleScenario(idx, { period: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">Etiqueta / Nota</label>
                <input 
                  type="text"
                  placeholder="ej: Hora Pico"
                  value={slot.params.customLabel || ''}
                  onChange={(e) => updateTripleScenario(idx, { customLabel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">Tiempo (min)</label>
                <input 
                  type="number"
                  value={slot.params.duration}
                  onChange={(e) => updateTripleScenario(idx, { duration: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white font-medium focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>
            </div>

            {/* Time Indicator */}
            <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800 flex justify-between items-center">
               <div className="text-center flex-1">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Inicio</p>
                  <p className="text-xs text-white font-black">{slot.params.hour || '08'}:00 {slot.params.period || 'AM'}</p>
               </div>
               <div className="h-4 w-px bg-zinc-800" />
               <div className="text-center flex-1">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Fin Estimado</p>
                  <p className="text-xs text-red-500 font-black">
                     {calculateEndTime(slot.params.hour || '08', slot.params.period || 'AM', slot.params.duration)}
                  </p>
               </div>
            </div>

            <div className="h-px bg-zinc-800 my-1" />

            {/* Inputs Manuales Rápidos */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] font-bold uppercase ml-1">λ</label>
                <input 
                  type="number"
                  value={slot.params.lambda}
                  onChange={(e) => updateTripleScenario(idx, { lambda: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] font-bold uppercase ml-1">μ</label>
                <input 
                  type="number"
                  value={slot.params.mu}
                  onChange={(e) => updateTripleScenario(idx, { mu: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] font-bold uppercase ml-1">Pers.</label>
                <select 
                  value={slot.params.s}
                  onChange={(e) => updateTripleScenario(idx, { s: Number(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white font-bold outline-none"
                >
                   {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* Resumen de Resultados */}
            {slot.result && (
              <div className="pt-4 grid grid-cols-2 gap-3 border-t border-zinc-800">
                 <div className="text-center">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase">Espera</p>
                    <p className={cn("text-lg font-black", slot.result.wq > 10 ? "text-red-500" : "text-green-500")}>
                       {slot.result.wq.toFixed(1)}m
                    </p>
                 </div>
                 <div className="text-center border-l border-zinc-800">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase">Uso</p>
                    <p className="text-lg font-black text-white">{(slot.result.utilization * 100).toFixed(0)}%</p>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* TABS PARA EL REPORTE DETALLADO */}
      <div className="mt-12 space-y-6">
         <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Inspección de Escenarios</h3>
            <div className="flex-1 h-px bg-zinc-800" />
         </div>

         <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit mx-auto shadow-2xl">
            {tripleScenarios.map((slot, idx) => (
               <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  disabled={!slot.result}
                  className={cn(
                     "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden",
                     activeTab === idx 
                        ? "bg-red-600 text-white shadow-xl shadow-red-900/20" 
                        : "text-zinc-500 hover:text-zinc-300 disabled:opacity-30"
                  )}
               >
                  Escenario {idx + 1}
                  {activeTab === idx && (
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30" />
                  )}
               </button>
            ))}
         </div>

         {/* REPORTE A ANCHO COMPLETO */}
         <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-10 min-h-[400px]">
            {tripleScenarios[activeTab]?.result ? (
               <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                  <div className="mb-10 text-center">
                     <h4 className="text-3xl font-black text-white uppercase mb-2">
                        {tripleScenarios[activeTab].params.day || 'Escenario'} | {tripleScenarios[activeTab].params.hour}:00 {tripleScenarios[activeTab].params.period}
                     </h4>
                     <p className="text-zinc-500 font-bold tracking-[0.2em] uppercase text-xs">
                        {tripleScenarios[activeTab].params.customLabel || 'Análisis de flujo detallado'}
                     </p>
                  </div>
                  
                  <HourlyBreakdown 
                     clients={tripleScenarios[activeTab].result!.clients} 
                     duration={tripleScenarios[activeTab].params.duration} 
                  />
               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center text-zinc-700">
                  <Play className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">Ejecuta la simulación para ver el reporte aquí</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
