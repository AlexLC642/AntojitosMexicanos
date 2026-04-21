
import React from 'react';
import { LayoutDashboard, Users, BarChart3, HelpCircle, Settings, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Comparativa', href: '/comparison' },
  { icon: BarChart3, label: 'Gráficas', href: '/charts' },
  { icon: Coffee, label: 'Productos', href: '/productos' }, // New link
  { icon: HelpCircle, label: 'Ayuda & Info', href: '/help' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 h-screen flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-red-600 p-2 rounded-lg">
          <Coffee className="text-white h-6 w-6" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight tracking-tight">ANTOJITOS</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] -mt-1">Mexicanos</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-zinc-900 text-white shadow-sm border border-zinc-800" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-red-600 rounded-r-full" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-red-500" : "group-hover:text-zinc-200"
              )} />
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-800">
        <Link 
          href="/settings"
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
            pathname === '/settings' ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-white"
          )}
        >
          <Settings className={cn("h-5 w-5", pathname === '/settings' ? "text-red-500" : "group-hover:text-zinc-200")} />
          <span className="font-semibold text-sm">Configuración</span>
        </Link>
      </div>
    </div>
  );
}
