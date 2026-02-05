"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { token, user } = useAuthStore();

    // Hydration safety check
    const isHydrated = useAuthStore.persist.hasHydrated();

    useEffect(() => {
        if (isHydrated && !token) {
            router.push("/login");
        }
    }, [token, isHydrated, router]);

    if (!isHydrated) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!token) return null; // Or a loading spinner while redirecting

    return (
        <div className="flex h-screen w-full overflow-hidden bg-muted/10">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
