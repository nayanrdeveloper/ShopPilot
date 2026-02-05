"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, BarChart3, Rocket, CheckCircle, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function LandingPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    return (
        <div ref={containerRef} className="flex min-h-screen flex-col bg-background text-foreground overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-10%] w-[35%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse delay-1000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] animate-pulse delay-2000" />
            </div>

            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-purple-100/10 bg-background/60 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 font-bold text-xl"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                            <Store className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">ShopPilot</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <Link href="/login">
                            <Button variant="ghost" className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 border-0">
                                Get Started
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative flex flex-col items-center justify-center py-20 lg:py-32 px-6 overflow-hidden">
                    <motion.div
                        style={{ y: heroY }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center gap-8 text-center max-w-5xl mx-auto z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full border border-purple-200/20 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-300 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            New: AI Description Generator Available 🚀
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Scale Your Store with <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                                Intelligent Automation
                            </span>
                        </h1>

                        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                            The all-in-one commerce operating system that writes your product descriptions,
                            predicts sales trends, and manages your inventory automatically.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button size="lg" className="h-14 px-8 text-lg w-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all rounded-full border-0">
                                    Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#features" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full rounded-full border-2 hover:bg-muted/50 backdrop-blur-sm">
                                    View Demo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Stats / Social Proof */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 shadow-sm z-${10 - i}`} />
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex gap-1 text-yellow-500">★★★★★</div>
                                <div>Loved by <strong>500+</strong> merchants</div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section id="features" className="container mx-auto py-24 px-6 relative">
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                            Superpowers for your <span className="text-purple-600 dark:text-purple-400">Online Business</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We've combined the power of generative AI with robust inventory management to give you the edge you need.
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
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent z-[-1]" />
                    <div className="container mx-auto max-w-6xl">
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            className="relative rounded-xl border border-border/50 bg-background/50 p-2 shadow-2xl backdrop-blur-xl"
                        >
                            <div className="absolute top-0 left-0 right-0 h-10 bg-muted/50 border-b flex items-center px-4 gap-2 rounded-t-xl">
                                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                            </div>
                            {/* Placeholder for actual dashboard UI aspect ratio */}
                            <div className="aspect-[16/9] w-full bg-slate-900/5 dark:bg-slate-50/5 mt-10 rounded-b-lg flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                                <BarChart3 className="h-24 w-24 text-muted-foreground/20 mb-4" />
                                <h3 className="text-2xl font-semibold text-muted-foreground/50">Experience the Dashboard</h3>
                                <Link href="/register">
                                    <Button className="mt-6 z-10" variant="secondary">Try Live Demo</Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="container mx-auto py-24 px-6">
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative rounded-3xl overflow-hidden px-6 py-20 text-center md:px-12 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white shadow-2xl"
                    >
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 h-64 w-64 -translate-y-1/2 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-64 w-64 translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                                Ready to launch your empire?
                            </h2>
                            <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
                                Join the waiting list today and get 3 months of premium AI features for free.
                                No commitment required.
                            </p>
                            <Link href="/register">
                                <Button size="lg" className="h-14 px-10 text-lg bg-white text-purple-900 hover:bg-white/90 font-bold rounded-full">
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
            <footer className="border-t bg-background/50 backdrop-blur-lg">
                <div className="container mx-auto py-12 px-6">
                    <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-5">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 font-bold text-xl text-foreground">
                                <Store className="h-6 w-6 text-purple-600" />
                                <span>ShopPilot</span>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Building the future of e-commerce with artificial intelligence and human-centric design.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Integrations</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Changelog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                        © 2024 ShopPilot Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color, bg, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-500/20"
        >
            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}