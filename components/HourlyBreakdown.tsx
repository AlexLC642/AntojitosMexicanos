
'use client';

import React from 'react';
import { ChevronDown, Clock, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientEvent } from '@/lib/simulation';

interface HourlyBreakdownProps {
  clients: ClientEvent[];
  duration: number;
}

export function HourlyBreakdown({ clients, duration }: HourlyBreakdownProps) {
  const hoursCount = Math.ceil(duration / 60);
  
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-1 w-12 bg-red-600 rounded-full" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Reporte Detallado por Bloques</h3>
        <div className="h-1 flex-1 bg-zinc-900 rounded-full" />
      </div>
      
      {Array.from({ length: hoursCount }).map((_, hourIdx) => {
        const hourStart = hourIdx * 60;
        const hourEnd = (hourIdx + 1) * 60;
        const hourClients = clients.filter(c => c.arrivalTime >= hourStart && c.arrivalTime < hourEnd);
        
        if (hourClients.length === 0 && hourIdx > 0) return null;

        const avgWait = hourClients.length > 0 
          ? hourClients.reduce((s, c) => s + c.waitTime, 0) / hourClients.length 
          : 0;
        const revenue = hourClients.reduce((s, c) => s + (c.totalSale || 0), 0);
        const totalProds = hourClients.reduce((s, c) => s + c.productCount, 0);

        return (
          <div key={hourIdx} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hour Header / Separator */}
            <div className="flex items-center justify-between bg-zinc-900 border-l-4 border-red-600 px-8 py-6 rounded-r-3xl border-y border-r border-zinc-800">
              <div>
                <h4 className="text-white text-xl font-black uppercase tracking-widest">
                  Estadísticas Hora {hourIdx + 1}
                </h4>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                   Intervalo: {hourStart} a {Math.min(duration, hourEnd)} minutos
                </p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Clientes</p>
                  <p className="text-white text-xl font-black">{hourClients.length}</p>
                </div>
                <div className="text-center border-l border-zinc-800 pl-8">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Ventas</p>
                  <p className="text-white text-xl font-black">Q{revenue.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
                  <div className="bg-red-600/10 p-3 rounded-2xl">
                     <Clock className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                     <p className="text-zinc-500 text-[10px] font-bold uppercase">Espera Media</p>
                     <p className={cn("text-xl font-black", avgWait > 10 ? "text-red-500" : "text-green-500")}>
                        {avgWait.toFixed(2)} min
                     </p>
                  </div>
               </div>
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
                  <div className="bg-zinc-800 p-3 rounded-2xl">
                     <ShoppingBag className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                     <p className="text-zinc-500 text-[10px] font-bold uppercase">Productos</p>
                     <p className="text-xl font-black text-white">{totalProds} Uds</p>
                  </div>
               </div>
               <div className="bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800 flex items-center gap-4">
                  <div className="bg-zinc-800 p-3 rounded-2xl">
                     <Users className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                     <p className="text-zinc-500 text-[10px] font-bold uppercase">Atención</p>
                     <p className="text-xl font-black text-white">{(hourClients.length / 60 * 60).toFixed(0)} cl/h</p>
                  </div>
               </div>
            </div>

            {/* Full FIFO Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-zinc-800/50 border-b border-zinc-800">
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">ID</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Servidor</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Llegada</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Fin</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">Espera</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Productos</th>
                           <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">Venta</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800/50">
                        {hourClients.map((c) => (
                           <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="px-6 py-5 font-mono text-xs font-bold text-zinc-400">
                                 #{String(c.id).padStart(3, '0')}
                              </td>
                              <td className="px-6 py-5">
                                 <span className="bg-zinc-800 text-[10px] font-bold px-2 py-1 rounded border border-zinc-700 text-zinc-400">
                                    S-{c.serverIndex}
                                 </span>
                              </td>
                              <td className="px-6 py-5 text-zinc-500 text-xs font-medium">{c.arrivalTime.toFixed(2)}m</td>
                              <td className="px-6 py-5 text-zinc-500 text-xs font-medium">{c.endTime.toFixed(2)}m</td>
                              <td className="px-6 py-5 text-center">
                                 <span className={cn(
                                    "text-xs font-black px-3 py-1 rounded-full",
                                    c.waitTime > 10 ? "bg-red-950/30 text-red-500 border border-red-900/50" : "bg-green-950/30 text-green-500 border border-green-900/50"
                                 )}>
                                    {c.waitTime.toFixed(2)}m
                                 </span>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {c.purchasedProducts.slice(0, 2).map((p, i) => (
                                       <span key={i} className="text-[9px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded border border-zinc-700 uppercase font-bold">
                                          {p}
                                       </span>
                                    ))}
                                    {c.purchasedProducts.length > 2 && (
                                       <span className="text-[9px] text-zinc-600 font-bold">+{c.purchasedProducts.length - 2}</span>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <span className="text-sm font-black text-green-500">Q{c.totalSale.toFixed(2)}</span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
            
            {/* Spacing between hours */}
            <div className="h-12" />
          </div>
        );
      })}
    </div>
  );
}
