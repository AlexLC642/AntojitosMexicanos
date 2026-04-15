
'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Info, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase">Ayuda & Información</h1>
          <p className="text-zinc-500 font-medium">Contexto del Proyecto: Antojitos Mexicanos</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <MapPin className="text-red-500 h-5 w-5" />
                Ubicación y Contexto
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                **Antojitos Mexicanos** se encuentra ubicado en el municipio de **Santa Cruz Verapaz, Alta Verapaz**. 
                Es un negocio local dedicado a la venta de comida típica mexicana con un enfoque en la rapidez y el sabor casero.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                El sistema de simulación fue diseñado para resolver problemas de saturación en horarios pico, 
                específicamente los días **viernes y sábados**, donde la variabilidad de la demanda es más crítica.
              </p>
            </section>

            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="text-red-500 h-5 w-5" />
                Nuestros Valores
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Autenticidad', icon: Heart },
                  { title: 'Calidad', icon: Star },
                  { title: 'Tradición', icon: History },
                  { title: 'Rapidez', icon: Zap },
                ].map((v) => (
                  <div key={v.title} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{v.title}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Clock className="text-red-500 h-5 w-5" />
              ¿Cómo usar el simulador?
            </h3>
            <div className="space-y-6 text-sm">
              <div className="flex gap-4">
                <div className="bg-red-600/10 text-red-500 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Configura los parámetros</h4>
                  <p className="text-zinc-500 leading-relaxed">Ajusta la tasa de llegada (λ), la velocidad de atención (μ) y el número de personal (s).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-600/10 text-red-500 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Inicia la simulación</h4>
                  <p className="text-zinc-500 leading-relaxed">Haz clic en el botón rojo para ejecutar el motor de simulación basado en modelos M/M/s.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-600/10 text-red-500 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Analiza los resultados</h4>
                  <p className="text-zinc-500 leading-relaxed">Revisa los KPIs en la parte superior y la tabla de clientes FIFO para ver el comportamiento detallado del sistema.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-red-600/10 text-red-500 h-8 w-8 rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                <div>
                  <h4 className="text-white font-bold mb-1">Compara escenarios</h4>
                  <p className="text-zinc-500 leading-relaxed">Usa la pestaña "Comparativa" para ver el rendimiento histórico y proyectar mejoras operativas.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center text-zinc-600 text-xs">
           © 2026 Antojitos Mexicanos - Proyecto de Simulación de Atención
        </div>
      </main>
    </div>
  );
}

function Star(props: any) { return <History {...props} /> }
function History(props: any) { return <ShieldCheck {...props} /> }
function Zap(props: any) { return <ShieldCheck {...props} /> }
