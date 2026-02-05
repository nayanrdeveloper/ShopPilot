'use client';

import { Store } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen w-full overflow-hidden">
      {/* Left Panel - Visuals */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 text-white lg:flex">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] h-[70%] w-[70%] animate-pulse rounded-full bg-purple-600/30 blur-[100px]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[70%] w-[70%] animate-pulse rounded-full bg-indigo-600/30 blur-[100px] delay-1000" />
          <div className="absolute top-[40%] left-[30%] h-[40%] w-[40%] rounded-full bg-pink-600/20 blur-[120px]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Store className="h-6 w-6" />
            </div>
            <span>ShopPilot</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-4xl leading-tight font-bold tracking-tight">
              "The intelligence engine your store was waiting for."
            </h2>
            <div className="mt-8 flex gap-4">
              <div className="h-1 w-12 rounded-full bg-purple-500" />
              <div className="h-1 w-2 rounded-full bg-zinc-700" />
              <div className="h-1 w-2 rounded-full bg-zinc-700" />
            </div>
            <p className="mt-8 text-lg text-zinc-400">
              Join thousands of merchants automating their description, inventory, and sales
              analysis with AI.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">© 2024 ShopPilot Inc.</div>
      </div>

      {/* Right Panel - Form */}
      <div className="dark:bg-background flex w-full items-center justify-center bg-gray-50/50 lg:w-1/2">
        <div className="w-full max-w-md p-8">
          <div className="mb-4 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Store className="text-primary h-6 w-6" />
              <span>ShopPilot</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
