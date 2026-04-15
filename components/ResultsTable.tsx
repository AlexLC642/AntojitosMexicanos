
import React from 'react';
import { ClientEvent } from '@/lib/simulation';

export function ResultsTable({ clients }: { clients: ClientEvent[] }) {
  if (clients.length === 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-8">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-white font-bold tracking-wide">REGISTRO DE CLIENTES (FIFO)</h3>
        <span className="text-zinc-500 text-xs font-medium bg-zinc-800 px-3 py-1 rounded-full">{clients.length} clientes procesados</span>
      </div>
      <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-900 shadow-sm">
            <tr className="border-b border-zinc-800">
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Llegada</th>
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Inicio</th>
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Fin</th>
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Espera</th>
              <th className="px-6 py-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Productos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {clients.slice(0, 100).map((client) => (
              <tr key={client.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 text-white text-sm font-medium">#{client.id}</td>
                <td className="px-6 py-4 text-zinc-400 text-sm font-mono">{client.arrivalTime.toFixed(2)}m</td>
                <td className="px-6 py-4 text-zinc-400 text-sm font-mono">{client.startTime.toFixed(2)}m</td>
                <td className="px-6 py-4 text-zinc-300 text-sm font-mono font-bold">{client.endTime.toFixed(2)}m</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-md font-bold ${client.waitTime > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {client.waitTime.toFixed(2)}m
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">
                  {client.productCount} uds
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length > 100 && (
          <div className="p-4 text-center text-zinc-600 text-xs italic border-t border-zinc-800">
            Mostrando los primeros 100 clientes de {clients.length}.
          </div>
        )}
      </div>
    </div>
  );
}
