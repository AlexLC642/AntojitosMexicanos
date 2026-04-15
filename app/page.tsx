
'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { KPIStats } from '@/components/KPIStats';
import { SimulationForm } from '@/components/SimulationForm';
import { ResultsTable } from '@/components/ResultsTable';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Info, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { result, runSimulation, params } = useSimulationStore();

  // Run initial simulation
  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Dashboard de Simulación</h1>
            <p className="text-zinc-500 font-medium">Análisis de flujo de clientes y optimización de servicio</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-zinc-400">Sistema Activo</span>
            </div>
          </div>
        </header>

        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            {result ? (
              <>
                <KPIStats 
                  wq={result.wq} 
                  w={result.w} 
                  lq={result.lq} 
                  utilization={result.utilization} 
                  totalProducts={result.totalProducts}
                />

                <div className="grid grid-cols-1 gap-8 mb-8">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Info className="h-32 w-32 rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertCircle className="text-red-500 h-5 w-5" />
                        Análisis del Sistema Actual
                      </h3>
                      <p className="text-zinc-400 leading-relaxed max-w-2xl mb-6">
                        Con una llegada de <span className="text-white font-bold">{params.lambda} clientes/hora</span> y 
                        <span className="text-white font-bold"> {params.s} servidores</span>, el tiempo de espera promedio en cola es de 
                        <span className={`font-bold ml-1 ${result.wq > 5 ? 'text-red-500' : 'text-green-500'}`}>
                          {result.wq.toFixed(2)} minutos.
                        </span>
                      </p>
                      <div className="flex gap-4">
                         <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold block">Status</span>
                            <span className="text-white text-sm font-bold">
                               {result.utilization > 0.9 ? 'Crítico (Saturado)' : result.utilization > 0.7 ? 'Alta Carga' : 'Óptimo'}
                            </span>
                         </div>
                         <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                            <span className="text-zinc-500 text-[10px] uppercase font-bold block">Eficiencia</span>
                            <span className="text-white text-sm font-bold">
                               {((1 - Math.abs(0.7 - result.utilization)) * 100).toFixed(0)}%
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ResultsTable clients={result.clients} />
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-zinc-900 rounded-3xl border border-dashed border-zinc-800">
                 <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-zinc-500 font-medium">Cargando resultados de simulación...</p>
                 </div>
              </div>
            )}
          </div>

          <SimulationForm />
        </div>
      </main>
    </div>
  );
}
