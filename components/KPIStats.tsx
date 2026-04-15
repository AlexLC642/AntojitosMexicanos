
import React from 'react';
import { Clock, Users, Activity, Percent, Coffee } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: any;
  color: string;
}

function KpiCard({ title, value, unit, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-white`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-zinc-500 text-sm ml-2 font-medium">{unit}</span>
      </div>
    </div>
  );
}

export function KPIStats({ 
  wq, w, lq, utilization, totalProducts
}: { 
  wq: number; w: number; lq: number; utilization: number; totalProducts: number 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <KpiCard 
        title="Espera en Cola (Wq)" 
        value={wq.toFixed(2)} 
        unit="min" 
        icon={Clock} 
        color="bg-orange-500" 
      />
      <KpiCard 
        title="Tiempo en Sistema (W)" 
        value={w.toFixed(2)} 
        unit="min" 
        icon={Activity} 
        color="bg-blue-500" 
      />
      <KpiCard 
        title="Clientes en Cola (Lq)" 
        value={lq.toFixed(2)} 
        unit="clientes" 
        icon={Users} 
        color="bg-purple-500" 
      />
      <KpiCard 
        title="Utilización (P)" 
        value={(utilization * 100).toFixed(1)} 
        unit="%" 
        icon={Percent} 
        color="bg-green-500" 
      />
      <KpiCard 
        title="Total Productos" 
        value={totalProducts} 
        unit="unidades" 
        icon={Coffee} 
        color="bg-red-500" 
      />
    </div>
  );
}
