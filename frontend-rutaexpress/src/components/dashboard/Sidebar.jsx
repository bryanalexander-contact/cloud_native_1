import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

// Definimos las rutas principales en un arreglo para mantener el código modular
const MAIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Shipments', path: '/shipments', icon: Package },
  { name: 'Fleet', path: '/fleet', icon: Truck },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Audit', path: '/audit', icon: ShieldCheck },
];

const FOOTER_NAV_ITEMS = [
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Help', path: '/help', icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900 text-slate-400 flex flex-col justify-between h-screen fixed left-0 top-0 border-r border-slate-800 select-none">
      {/* Contenedor del Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M3 7H17L21 11V17H19C19 15.9 18.1 15 17 15C15.9 15 15 15.9 15 17H9C9 15.9 8.1 15 7 15C5.9 15 5 15.9 5 17H3V7Z" fill="#3b82f6"/>
        </svg>
        <span className="text-white text-lg font-bold tracking-wide">RutaExpress</span>
      </div>

      {/* Navegación Principal */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
                }
              `}
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Navegación Inferior (Settings / Help) */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {FOOTER_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
                }
              `}
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}