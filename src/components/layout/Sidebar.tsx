import React from 'react';
import { Building2, MapPin, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Tableau de Bord', icon: MapPin, href: '/' },
  { name: 'Agents', icon: Users, href: '/agents' },
  { name: 'Paramètres', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r border-border">
      {/* Logo ENEO */}
      <div className="flex h-16 items-center justify-center border-b border-border">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-primary">ENEO</h1>
            <p className="text-xs text-muted-foreground">Centre de Contrôle</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="text-center text-xs text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>© 2024 ENEO</p>
        </div>
      </div>
    </div>
  );
}