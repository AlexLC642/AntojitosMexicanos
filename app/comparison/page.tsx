
'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { RefreshCcw, TrendingUp, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { TripleComparison } from '@/components/TripleComparison';
import { cn } from '@/lib/utils';

export default function ComparisonPage() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'table' | 'triple'>('triple');
  const scenarios = useSimulationStore(state => state.scenarios);
  const compareScenarios = useSimulationStore(state => state.compareScenarios);

  useEffect(() => {
    setMounted(true);
    compareScenarios();
  }, [compareScenarios]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await useSimulationStore.getState().fetchProducts();
    await useSimulationStore.getState().fetchScenarios();
    compareScenarios();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 lg:p-12">
          <div className="animate-pulse flex flex-col gap-4">
             <div className="h-10 w-64 bg-zinc-900 rounded-xl" />
             <div className="h-4 w-48 bg-zinc-900 rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Comparativa de Escenarios</h1>
            <p className="text-zinc-500 font-medium">Análisis semanal y optimización operativa</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* View Switcher */}
            <div className="bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex">
              <button 
                onClick={() => setView('table')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  view === 'table' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <TableIcon className="h-3.5 w-3.5" />
                Tabla General
              </button>
              <button 
                onClick={() => setView('triple')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  view === 'triple' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Analizador Triple
              </button>
            </div>

            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-zinc-800 transition-all text-white font-bold active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Sincronizando...' : 'Actualizar Datos'}
            </button>
          </div>
        </header>

        {view === 'triple' ? (
          <TripleComparison />
        ) : (
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50">
                      <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Escenario</th>
                      <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">λ (Lleg)</th>
                      <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">μ (Serv)</th>
                      <th className="px-6 py-5 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">s (Pers)</th>
                      <th className="px-6 py-5 text-zinc-200 text-[10px] font-black uppercase tracking-widest text-center bg-zinc-800/50">Wq (Cola)</th>
                      <th className="px-6 py-5 text-zinc-200 text-[10px] font-black uppercase tracking-widest text-center bg-zinc-800/50">W (Sist)</th>
                      <th className="px-6 py-5 text-zinc-200 text-[10px] font-black uppercase tracking-widest text-center bg-zinc-800/50">Lq (Cola)</th>
                      <th className="px-6 py-5 text-zinc-200 text-[10px] font-black uppercase tracking-widest text-center bg-zinc-800/50">Utilización</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {scenarios.map((scenario) => (
                      <tr key={scenario.id} className="hover:bg-zinc-800/40 transition-colors group">
                        <td className="px-6 py-5 font-bold text-white text-sm">
                          {scenario.name}
                        </td>
                        <td className="px-6 py-5 text-zinc-500 text-sm text-center font-mono">{scenario.params?.lambda || 0}</td>
                        <td className="px-6 py-5 text-zinc-500 text-sm text-center font-mono">{scenario.params?.mu || 0}</td>
                        <td className="px-6 py-5 text-zinc-500 text-sm text-center font-mono font-bold text-zinc-300">{scenario.params?.s || 0}</td>
                        
                        <td className="px-6 py-5 text-center bg-zinc-800/20">
                          <span className={`text-sm font-bold font-mono ${scenario.result && scenario.result.wq > 10 ? 'text-red-500' : 'text-green-500'}`}>
                            {scenario.result ? `${scenario.result.wq.toFixed(2)}m` : '---'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center bg-zinc-800/20">
                           <span className="text-zinc-300 text-sm font-mono">
                              {scenario.result ? `${scenario.result.w.toFixed(2)}m` : '---'}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-center bg-zinc-800/20">
                           <span className="text-zinc-300 text-sm font-mono">
                              {scenario.result ? scenario.result.lq.toFixed(2) : '---'}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-center bg-zinc-800/20">
                           <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-500 ${scenario.result && scenario.result.utilization > 0.9 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${Math.min(100, Math.max(0, (scenario.result?.utilization || 0) * 100))}%` }}
                                 />
                              </div>
                              <span className="text-xs font-bold font-mono text-zinc-400">
                                 {scenario.result ? `${(scenario.result.utilization * 100).toFixed(0)}%` : '---'}
                              </span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                     <TrendingUp className="text-red-500 h-5 w-5" />
                     Insights de Capacidad
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                     El escenario de **Viernes y Sábado** muestra los picos más altos de saturación. Se recomienda 
                     asignar al menos **4 personas** durante estos horarios para mantener el tiempo de espera (Wq) 
                     por debajo de los 5 minutos.
                  </p>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                  <h4 className="text-white font-bold mb-4">Recomendación de Optimización</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                     Para los horarios de **Lunes y Martes**, el sistema está subutilizado. Podría operarse con 
                     **1 persona** de atención si se optimizan los procesos de toma de pedido, reduciendo costos operativos.
                  </p>
               </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
