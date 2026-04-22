
import React from 'react';
import { Clock, Users, Activity, Percent, Coffee, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: any;
  color: string;
}

function KpiCard({ title, value, unit, icon: Icon, color }: KpiCardProps) {
  const isInfinity = value === "Infinity" || value === "Infinity.00";
  const displayValue = isInfinity ? "Saturado" : value;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between min-h-[140px] transition-all hover:border-zinc-700">
      <div className="flex justify-between items-start gap-2">
        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-tight">{title}</span>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-white shrink-0`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className={cn(
            "font-black tracking-tighter text-white transition-all",
            isInfinity ? "text-xl text-red-500" : "text-2xl lg:text-3xl"
          )}>
            {displayValue}
          </span>
          {unit && !isInfinity && (
            <span className="text-zinc-500 text-[10px] font-bold uppercase">{unit}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function KPIStats({ 
  wq, w, lq, utilization, totalProducts, totalRevenue
}: { 
  wq: number; w: number; lq: number; utilization: number; totalProducts: number; totalRevenue: number 
}) {
  const theme = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <KpiCard 
        title="Espera en Cola (Wq)" 
        value={wq.toFixed(2)} 
        unit="min" 
        icon={Clock} 
        color={theme.isRed ? "bg-orange-500" : "bg-green-500"} 
      />
      <KpiCard 
        title="Tiempo en Sistema (W)" 
        value={w.toFixed(2)} 
        unit="min" 
        icon={Activity} 
        color={theme.isRed ? "bg-blue-500" : "bg-emerald-500"} 
      />
      <KpiCard 
        title="Clientes en Cola (Lq)" 
        value={lq.toFixed(2)} 
        unit="clientes" 
        icon={Users} 
        color={theme.isRed ? "bg-purple-500" : "bg-teal-500"} 
      />
      <KpiCard 
        title="Utilización (ρ)" 
        value={(utilization * 100).toFixed(1)} 
        unit="%" 
        icon={Percent} 
        color={theme.isRed ? "bg-green-500" : "bg-lime-500"} 
      />
      <KpiCard 
        title="Total Productos" 
        value={totalProducts} 
        unit="uds" 
        icon={Coffee} 
        color={theme.isRed ? "bg-red-500" : "bg-green-500"} 
      />
      <KpiCard 
        title="Ingresos Estimados" 
        value={`Q${totalRevenue.toFixed(2)}`} 
        unit="" 
        icon={TrendingUp} 
        color={theme.isRed ? "bg-emerald-500" : "bg-green-600"} 
      />
    </div>
  );
}
