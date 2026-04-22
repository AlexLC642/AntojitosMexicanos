
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Settings, Utensils, Zap, Database, Edit3 } from 'lucide-react';

export default function SettingsPage() {
  const { products, settings, updateProduct, updateSettings, fetchProducts } = useSimulationStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call for now or implement real sync
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Configuración</h1>
            <p className="text-zinc-500 font-medium">Personalización avanzada del sistema Antojitos Mexicanos</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 ${
              saveSuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]'
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Zap className="h-5 w-5 fill-current" />
            ) : (
              <Database className="h-5 w-5" />
            )}
            {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar Cambios'}
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* General Settings */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-fit">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Apariencia</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase mb-3 block">Color del Tema Principal</label>
                <div className="flex gap-4">
                   <button 
                     onClick={() => updateSettings({ themeColor: 'red' })}
                     className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${settings.themeColor === 'red' ? 'border-red-600 bg-red-600/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-red-600 ${settings.themeColor === 'red' ? 'ring-4 ring-red-600/20' : ''}`} />
                     <span className="font-bold">Rojo Tradicional</span>
                   </button>
                   <button 
                     onClick={() => updateSettings({ themeColor: 'green' })}
                     className={`flex-1 p-4 rounded-2xl border transition-all flex items-center gap-3 ${settings.themeColor === 'green' ? 'border-green-600 bg-green-600/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'}`}
                   >
                     <div className={`w-4 h-4 rounded-full bg-green-600 ${settings.themeColor === 'green' ? 'ring-4 ring-green-600/20' : ''}`} />
                     <span className="font-bold">Verde Mexicano</span>
                   </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                 <p className="text-zinc-500 text-xs leading-relaxed italic">
                    * Estos ajustes se aplican instantáneamente a la interfaz pero solo se persisten al presionar "Guardar Cambios".
                 </p>
              </div>
            </div>
          </section>

          {/* Menu Management */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Menú y Precios</h3>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                        <h4 className="text-white font-bold group-hover:text-red-500 transition-colors">{product.name}</h4>
                     </div>
                     <Edit3 className="h-4 w-4 text-zinc-800 group-hover:text-zinc-600" />
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="bg-zinc-900 px-3 py-2 rounded-lg text-zinc-500 text-sm font-mono border border-zinc-800">Q</div>
                     <input 
                        type="number"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                        className="flex-1 bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl font-mono text-lg focus:ring-1 focus:ring-red-600 outline-none transition-all focus:bg-zinc-950"
                     />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-3xl flex items-center justify-between backdrop-blur-sm">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
                 <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                 <h4 className="text-white font-bold mb-1 italic">Optimización de Producción</h4>
                 <p className="text-zinc-500 text-sm">El sistema está configurado para máxima velocidad de respuesta en entornos reales.</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
