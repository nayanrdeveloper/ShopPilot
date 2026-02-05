'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Store,
  ShoppingBag,
  BarChart3,
  Rocket,
  Zap,
  ShieldCheck,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <div
      ref={containerRef}
      className="bg-background text-foreground flex min-h-screen flex-col overflow-hidden selection:bg-purple-500/30 selection:text-purple-200"
    >
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[40%] w-[35%] animate-pulse rounded-full bg-indigo-500/20 blur-[120px] delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] h-[40%] w-[40%] animate-pulse rounded-full bg-pink-500/20 blur-[120px] delay-2000" />
      </div>

      {/* Navbar */}
      <header className="bg-background/60 sticky top-0 z-50 w-full border-b border-purple-100/10 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Store className="h-5 w-5" />
            </div>
            <span className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-transparent">
              ShopPilot
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button
                variant="ghost"
                className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="border-0 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-purple-500/40">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-20 lg:py-32">
          <motion.div
            style={{ y: heroY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm dark:text-purple-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
              </span>
              New: AI Description Generator Available 🚀
            </motion.div>

            <h1 className="text-5xl leading-tight font-extrabold tracking-tight md:text-7xl">
              Scale Your Store with <br className="hidden md:block" />
              <span className="animate-gradient-x bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-[length:200%_auto] bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
              The all-in-one commerce operating system that writes your product descriptions,
              predicts sales trends, and manages your inventory automatically.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 w-full rounded-full border-0 bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-lg shadow-xl shadow-purple-500/20 transition-all hover:scale-105 hover:shadow-purple-500/40"
                >
                  Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:bg-muted/50 h-14 w-full rounded-full border-2 px-8 text-lg backdrop-blur-sm"
                >
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats / Social Proof */}
            <div className="text-muted-foreground mt-12 flex items-center justify-center gap-8 text-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`border-background h-10 w-10 rounded-full border-2 bg-gradient-to-br from-gray-100 to-gray-300 shadow-sm dark:from-gray-700 dark:to-gray-900 z-${10 - i}`}
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-1 text-yellow-500">★★★★★</div>
                <div>
                  Loved by <strong>500+</strong> merchants
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="relative container mx-auto px-6 py-24">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Superpowers for your{' '}
              <span className="text-purple-600 dark:text-purple-400">Online Business</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We've combined the power of generative AI with robust inventory management to give you
              the edge you need.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Instant AI Magic"
              description="Upload a product image and let our AI write a perfect, SEO-optimized description in seconds. No more writer's block."
              color="text-yellow-500"
              bg="bg-yellow-500/10"
              delay={0}
            />
            <FeatureCard
              icon={ShoppingBag}
              title="Smart Inventory"
              description="Real-time tracking of stock levels across multiple variants. Get low-stock alerts before you run out."
              color="text-blue-500"
              bg="bg-blue-500/10"
              delay={0.1}
            />
            <FeatureCard
              icon={Rocket}
              title="Sales Forecasting"
              description="Predict future demand based on historical data and seasonal trends. Plan your procurement with confidence."
              color="text-purple-500"
              bg="bg-purple-500/10"
              delay={0.2}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure by Default"
              description="Enterprise-grade security with encrypted data, role-based access control, and automated backups."
              color="text-green-500"
              bg="bg-green-500/10"
              delay={0.3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Deep Analytics"
              description="Visualize your revenue, conversion rates, and customer acquisition costs in one beautiful dashboard."
              color="text-pink-500"
              bg="bg-pink-500/10"
              delay={0.4}
            />
            <FeatureCard
              icon={Store}
              title="Multi-Store Support"
              description="Manage multiple brands or storefronts from a single account. Seamlessly switch contexts in one click."
              color="text-indigo-500"
              bg="bg-indigo-500/10"
              delay={0.5}
            />
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="relative overflow-hidden px-6 py-24">
          <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="border-border/50 bg-background/50 relative rounded-xl border p-2 shadow-2xl backdrop-blur-xl"
            >
              <div className="bg-muted/50 absolute top-0 right-0 left-0 flex h-10 items-center gap-2 rounded-t-xl border-b px-4">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              {/* Placeholder for actual dashboard UI aspect ratio */}
              <div className="group relative mt-10 flex aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-b-lg bg-slate-900/5 dark:bg-slate-50/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
                <BarChart3 className="text-muted-foreground/20 mb-4 h-24 w-24" />
                <h3 className="text-muted-foreground/50 text-2xl font-semibold">
                  Experience the Dashboard
                </h3>
                <Link href="/register">
                  <Button className="z-10 mt-6" variant="secondary">
                    Try Live Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container mx-auto px-6 py-24">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 px-6 py-20 text-center text-white shadow-2xl md:px-12"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/30 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Ready to launch your empire?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-purple-100">
                Join the waiting list today and get 3 months of premium AI features for free. No
                commitment required.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-white px-10 text-lg font-bold text-purple-900 hover:bg-white/90"
                >
                  Get Started Now
                </Button>
              </Link>
              <p className="mt-6 text-sm text-purple-200/60">
                No credit card required • Cancel anytime • 24/7 Support
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background/50 border-t backdrop-blur-lg">
        <div className="container mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-2">
              <div className="text-foreground flex items-center gap-2 text-xl font-bold">
                <Store className="h-6 w-6 text-purple-600" />
                <span>ShopPilot</span>
              </div>
              <p className="text-muted-foreground max-w-xs text-sm">
                Building the future of e-commerce with artificial intelligence and human-centric
                design.
              </p>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Product</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Company</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-foreground mb-4 font-semibold">Legal</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            © 2024 ShopPilot Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bg,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group border-border/50 bg-card rounded-2xl border p-8 shadow-sm transition-all hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/5"
    >
      <div
        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110 group-hover:rotate-3`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-foreground mb-3 text-xl font-bold transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
