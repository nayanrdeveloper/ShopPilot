"use client";

import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function Header() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
                <span className="text-xs text-muted-foreground">Welcome back, {user?.name || 'Owner'}</span>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                </div>
            </div>
        </header>
    );
}
