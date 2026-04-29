
'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Banknote, TrendingUp, ChevronRight, Info, Package, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Desglose de costos basado en investigación de Guatemala
const COST_BREAKDOWN: Record<string, { details: string; units: string }> = {
  'Hamburguesas': { details: 'Carne Res (Q4.50) + Pan Artesanal (Q1.25) + Verduras y Salsas (Q1.25)', units: 'Por unidad' },
  'Burritos': { details: 'Tortilla Harina Gigante (Q1.50) + Carne/Relleno (Q4.50) + Queso y Salsas (Q2.00)', units: 'Por unidad' },
  'Tacos (Orden)': { details: '3 Tortillas Maíz (Q1.00) + Carne (Q4.00) + Salsa/Cebolla/Cilantro (Q1.50)', units: 'Orden de 3' },
  'Gringas': { details: 'Tortilla Harina (Q1.50) + Pastor y Queso (Q5.00) + Piña/Salsa (Q1.00)', units: 'Por unidad' },
  'Hot dogs': { details: 'Pan (Q1.50) + Salchicha (Q2.50) + Aderezos (Q1.00)', units: 'Por unidad' },
  'Shucos': { details: 'Pan Shuco (Q1.50) + Embutido Mixto (Q3.00) + Guacamol/Repollo (Q2.00)', units: 'Por unidad' },
  'Coca-Cola': { details: 'Caja de 12 unidades (Q78.00) → Q6.50 cada una', units: 'Botella 355ml' },
  'Fanta': { details: 'Caja de 12 unidades (Q78.00) → Q6.50 cada una', units: 'Botella 355ml' },
  'Licuados': { details: 'Leche/Agua (Q2.00) + Fruta de Estación (Q2.50) + Azúcar/Hielo (Q0.50)', units: 'Vaso 12oz' },
  'Té': { details: 'Caja de 24 sobres (Q20.00 → Q0.83/u) + Azúcar/Gas/Agua (Q0.52)', units: 'Taza 8oz' },
  'Café': { details: 'Café Molido Regional (Q1.50) + Azúcar/Agua/Gas (Q0.50)', units: 'Taza 8oz' },
};

export default function UtilidadesPage() {
  const { products, fetchProducts } = useSimulationStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <Banknote className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">Módulo de Utilidades</h1>
          </div>
          <p className="text-zinc-500 font-medium italic">Análisis detallado de escandallos y márgenes de ganancia (Materia Prima - Guatemala)</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-800/50 border-b border-zinc-800">
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Producto</th>
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">Desglose de Materia Prima</th>
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">P. Venta</th>
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">Costo U.</th>
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-right">Ganancia</th>
                    <th className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">Margen %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {products.map((p) => {
                    const breakdown = COST_BREAKDOWN[p.name] || { details: 'Costos variables de preparación', units: 'Unidad' };
                    const profit = p.price - p.cost;
                    const marginPercent = (profit / p.price) * 100;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-800/30 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-white font-black text-lg group-hover:text-blue-400 transition-colors">{p.name}</span>
                            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-tighter">{p.category} • {breakdown.units}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-start gap-3 max-w-md">
                            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 shrink-0">
                               <Package className="h-4 w-4 text-zinc-500" />
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                              {breakdown.details}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-white font-mono font-bold">Q{p.price.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-red-500/80 font-mono text-sm font-bold">Q{p.cost.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-green-500 font-mono font-black text-lg">Q{profit.toFixed(2)}</span>
                            <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Utilidad Neta</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border",
                            marginPercent > 60 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}>
                            <TrendingUp className="h-3 w-3" />
                            {marginPercent.toFixed(0)}%
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-600/20 p-8 rounded-[2.5rem] flex items-center gap-8">
             <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-600/20">
                <Info className="h-8 w-8 text-white" />
             </div>
             <div>
                <h4 className="text-white font-bold text-lg mb-1 italic">¿Cómo se calculan estos valores?</h4>
                <p className="text-zinc-500 text-sm max-w-4xl leading-relaxed">
                  Los costos unitarios representan la <strong>materia prima directa (MPD)</strong>. Se toma el precio de mercado 
                  en Guatemala (ej: carne de res, tortillas, pan de panadería local) y se divide por el rendimiento de la receta. 
                  Esto permite que el simulador proyecte no solo cuántos clientes atiendes, sino exactamente cuánto dinero 
                  queda en caja después de reponer el inventario.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
