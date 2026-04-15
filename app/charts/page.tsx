
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Users } from 'lucide-react';

export default function ChartsPage() {
  const { result } = useSimulationStore();

  if (!result) return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 flex items-center justify-center">
        <p className="text-zinc-500">Inicia una simulación en el Dashboard para ver las gráficas.</p>
      </main>
    </div>
  );

  // Prepare data for Wait Time Over Time
  const timelineData = result.clients.slice(0, 50).map(c => ({
    name: `C${c.id}`,
    espera: parseFloat(c.waitTime.toFixed(2)),
    atencion: parseFloat(c.serviceDuration.toFixed(2)),
  }));

  // Prepare data for Histogram (simplified)
  const histogramData = [
    { range: '0-2m', count: result.clients.filter(c => c.waitTime <= 2).length },
    { range: '2-5m', count: result.clients.filter(c => c.waitTime > 2 && c.waitTime <= 5).length },
    { range: '5-10m', count: result.clients.filter(c => c.waitTime > 5 && c.waitTime <= 10).length },
    { range: '10m+', count: result.clients.filter(c => c.waitTime > 10).length },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Análisis Gráfico</h1>
          <p className="text-zinc-500 font-medium">Visualización de tiempos y distribución de carga</p>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Timeline Chart */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-red-500 h-5 w-5" />
              Tiempos de Espera por Cliente (FIFO)
            </h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorEspera" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} unit="m" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#fafafa', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="espera" stroke="#ef4444" fillOpacity={1} fill="url(#colorEspera)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-zinc-500 text-xs text-center italic">Mostrando los primeros 50 clientes simulados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Histogram Chart */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Clock className="text-blue-500 h-5 w-5" />
                Distribución de Espera
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="range" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                      cursor={{ fill: '#27272a' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col justify-center">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Users className="text-green-500 h-5 w-5" />
                Resumen de Rendimiento
              </h3>
              <div className="space-y-6">
                <div>
                   <span className="text-zinc-500 text-xs font-bold uppercase block mb-1">Satisfacción Promedio</span>
                   <div className="flex items-end gap-2 text-white">
                      <span className="text-4xl font-black">{((result.clients.filter(c => c.waitTime < 3).length / result.clients.length) * 100).toFixed(0)}%</span>
                      <span className="text-zinc-500 font-medium mb-1">espera &lt; 3m</span>
                   </div>
                </div>
                <div className="h-px bg-zinc-800 w-full"></div>
                <div>
                   <span className="text-zinc-500 text-xs font-bold uppercase block mb-1">Cuello de Botella</span>
                   <p className="text-zinc-400 text-sm leading-relaxed">
                      El sistema alcanza su punto crítico a partir de los **{result.clients.length} clientes**. 
                      La variabilidad del tiempo de servicio es de **{(result.clients[0]?.serviceDuration || 0).toFixed(1)}m** promedio.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
