
'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Utensils, Droplets, Tag } from 'lucide-react';

export default function ProductosPage() {
  const { products, fetchProducts } = useSimulationStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { name: 'Comida', icon: Utensils, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'Bebidas', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Nuestro Menú</h1>
          <p className="text-zinc-500 font-medium">Gestión de precios y catálogo de Antojitos Mexicanos</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 ${cat.bg} rounded-2xl ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{cat.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {products
                  .filter(p => p.category === cat.name)
                  .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-red-600/50 transition-all">
                    <div className="flex items-center gap-3">
                       <Tag className="h-4 w-4 text-zinc-700 group-hover:text-red-500 transition-colors" />
                       <span className="font-semibold text-zinc-200 group-hover:text-white">{product.name}</span>
                    </div>
                    <span className="text-lg font-black text-white px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
                       Q{product.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
           <h4 className="text-white font-bold mb-4">Análisis de Precios</h4>
           <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Los precios mostrados aquí son utilizados por el simulador para proyectar los ingresos totales. 
              Puedes editarlos en la sección de **Configuración** para ver cómo afectan la rentabilidad proyectada 
              durante los diferentes turnos y días de la semana.
           </p>
        </div>
      </main>
    </div>
  );
}
