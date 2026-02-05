'use client';

import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-6 backdrop-blur">
      <div className="flex flex-col">
        <h1 className="text-foreground text-lg font-semibold">Dashboard</h1>
        <span className="text-muted-foreground text-xs">Welcome back, {user?.name || 'Owner'}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="text-muted-foreground h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
