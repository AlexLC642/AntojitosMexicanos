
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Settings, Utensils, Zap, Database, Edit3 } from 'lucide-react';

export default function SettingsPage() {
  const { products, settings, updateProduct, updateSettings } = useSimulationStore();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Configuración</h1>
          <p className="text-zinc-500 font-medium">Personalización avanzada del sistema Antojitos Mexicanos</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* General Settings */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Parámetros del Sistema</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase mb-3 block">Color del Tema Principal</label>
                <div className="flex gap-4">
                   <button 
                     onClick={() => updateSettings({ themeColor: 'red' })}
                     className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${settings.themeColor === 'red' ? 'border-red-600 bg-red-600/5' : 'border-zinc-800 bg-zinc-950 text-zinc-500'}`}
                   >
                     <div className="w-4 h-4 rounded-full bg-red-600" />
                     <span className="font-bold">Rojo Tradicional</span>
                   </button>
                   <button 
                     onClick={() => updateSettings({ themeColor: 'green' })}
                     className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${settings.themeColor === 'green' ? 'border-green-600 bg-green-600/5' : 'border-zinc-800 bg-zinc-950 text-zinc-500'}`}
                   >
                     <div className="w-4 h-4 rounded-full bg-green-600" />
                     <span className="font-bold">Verde Mexicano</span>
                   </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase mb-3 block">Distribución de Atención</label>
                <select 
                  value={settings.distribution}
                  onChange={(e) => updateSettings({ distribution: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="exponential">M/M/s (Exponencial - Variable)</option>
                  <option value="constant">M/D/s (Determinista - Constante)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase mb-3 block">Máximo de Filas en Tabla</label>
                <input 
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={settings.maxRows}
                  onChange={(e) => updateSettings({ maxRows: Number(e.target.value) })}
                  className="w-full accent-red-600"
                />
                <div className="flex justify-between text-zinc-500 text-[10px] font-bold mt-2">
                   <span>50 REGISTROS</span>
                   <span className="text-white bg-zinc-800 px-2 rounded">{settings.maxRows}</span>
                   <span>500 REGISTROS</span>
                </div>
              </div>
            </div>
          </section>

          {/* Menu Management */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Gestión del Menú y Precios</h3>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                        <h4 className="text-white font-bold">{product.name}</h4>
                     </div>
                     <Edit3 className="h-4 w-4 text-zinc-800" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     <label className="text-zinc-600 text-[10px] font-bold uppercase">Precio Unitario (Q)</label>
                     <input 
                        type="number"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                        className="bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl font-mono text-lg focus:ring-1 focus:ring-red-600 outline-none"
                     />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                 <Database className="h-8 w-8 text-zinc-700" />
              </div>
              <div>
                 <h4 className="text-white font-bold mb-1">Backup de Configuración</h4>
                 <p className="text-zinc-500 text-sm">Tus ajustes se guardan localmente en el navegador para futuras sesiones.</p>
              </div>
           </div>
           <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-xl transition-all border border-zinc-700">
              Exportar JSON
           </button>
        </div>
      </main>
    </div>
  );
}
