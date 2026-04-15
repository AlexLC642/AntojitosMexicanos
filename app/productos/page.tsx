
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Utensils, Droplets, Star } from 'lucide-react';

const products = [
  { category: 'Comida', items: ['Hamburguesas', 'Burritos', 'Tacos', 'Gringas', 'Poblanas', 'Hot dogs', 'Shucos'], icon: Utensils },
  { category: 'Bebidas', items: ['Coca-Cola', 'Fanta', 'Licuados', 'Té', 'Café'], icon: Droplets },
];

export default function ProductosPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Nuestro Menú</h1>
          <p className="text-zinc-500 font-medium">Antojitos Mexicanos - Santa Cruz Verapaz</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((cat) => (
            <div key={cat.category} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-600/10 rounded-2xl text-red-500">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{cat.category}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-red-600/50 transition-all">
                    <span className="font-medium text-zinc-200 group-hover:text-white">{item}</span>
                    <Star className="h-4 w-4 text-zinc-800 group-hover:text-red-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
           <h4 className="text-white font-bold mb-4">Información de Producción</h4>
           <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Cada pedido en **Antojitos Mexicanos** se prepara al momento para garantizar la frescura y el sabor auténtico. 
              Nuestro simulador considera una variabilidad de productos de 1 a 4 unidades por cliente, basándose en el 
              promedio histórico recolectado durante la fase de observación.
           </p>
        </div>
      </main>
    </div>
  );
}
