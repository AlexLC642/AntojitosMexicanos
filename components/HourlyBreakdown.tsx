
'use client';

import React from 'react';
import { ChevronDown, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientEvent } from '@/lib/simulation';

interface HourlyBreakdownProps {
  clients: ClientEvent[];
  duration: number;
}

export function HourlyBreakdown({ clients, duration }: HourlyBreakdownProps) {
  const hoursCount = Math.ceil(duration / 60);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-red-500" />
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Desglose Detallado por Horas</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: hoursCount }).map((_, hourIdx) => {
          const hourStart = hourIdx * 60;
          const hourEnd = (hourIdx + 1) * 60;
          const hourClients = clients.filter(c => c.arrivalTime >= hourStart && c.arrivalTime < hourEnd);
          
          if (hourClients.length === 0 && hourIdx > 0) return null;

          const avgWait = hourClients.length > 0 
            ? hourClients.reduce((s, c) => s + c.waitTime, 0) / hourClients.length 
            : 0;
          const revenue = hourClients.reduce((s, c) => s + (c.totalSale || 0), 0);
          const maxWait = hourClients.length > 0 
            ? Math.max(...hourClients.map(c => c.waitTime)) 
            : 0;

          return (
            <details 
              key={hourIdx} 
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group/detail transition-all open:ring-2 open:ring-red-600/20"
            >
              <summary className="px-6 py-5 cursor-pointer hover:bg-zinc-800/50 transition-colors list-none flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-zinc-800 h-10 w-10 rounded-xl flex items-center justify-center font-black text-red-500 text-sm border border-zinc-700">
                    H{hourIdx + 1}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Bloque Horario {hourIdx + 1}</p>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                      {hourStart} - {Math.min(duration, hourEnd)} MIN
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-zinc-600 group-open/detail:rotate-180 transition-transform" />
              </summary>
              
              <div className="p-6 bg-zinc-950/50 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
                    <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Espera Media</p>
                    <p className={cn("text-lg font-black", avgWait > 10 ? "text-red-500" : "text-green-500")}>
                      {avgWait.toFixed(1)}m
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
                    <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Ventas</p>
                    <p className="text-lg font-black text-white">Q{revenue.toFixed(0)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Detalle de Clientes</span>
                    <span className="text-[10px] font-mono text-zinc-400">{hourClients.length} atendidos</span>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto custom-scrollbar border border-zinc-800 rounded-2xl">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-900 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">ID</th>
                          <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-center">Espera</th>
                          <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest text-right">Venta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {hourClients.map(c => (
                          <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-4 py-3 text-xs font-mono text-zinc-500">#{String(c.id).padStart(3, '0')}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={cn(
                                "text-xs font-black",
                                c.waitTime > 10 ? "text-red-500" : "text-green-500"
                              )}>
                                {c.waitTime.toFixed(1)}m
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-white">
                              Q{c.totalSale.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
