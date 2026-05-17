import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, switchRole } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">{children}</div>;
  }

  const navItems = {
    employee: [
      { label: 'Dashboard', href: '/employee' },
      { label: 'My Goals', href: '/employee/goals' },
      { label: 'Progress Updates', href: '/employee/updates' },
    ],
    manager: [
      { label: 'Dashboard', href: '/manager' },
      { label: 'Team Goals', href: '/manager/goals' },
      { label: 'Approvals', href: '/manager/approvals' },
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'All Goals', href: '/admin/goals' },
      { label: 'Users', href: '/admin/users' },
    ],
  };

  const currentNavItems = navItems[user.role] || [];

  const handleRoleSwitch = (role: 'employee' | 'manager' | 'admin') => {
    switchRole(role);
    setLocation(`/${role}`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">GoalTracker</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{user.role}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {currentNavItems.map((item) => (
            <button
              key={item.href}
              onClick={() => setLocation(item.href)}
              className={cn(
                'w-full text-left px-4 py-2 rounded-lg transition-colors',
                location === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Role Switcher */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Switch Role</p>
            <div className="space-y-1">
              {(['employee', 'manager', 'admin'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  disabled={user.role === role}
                  className={cn(
                    'w-full px-3 py-1.5 text-xs rounded transition-colors capitalize',
                    user.role === role
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
