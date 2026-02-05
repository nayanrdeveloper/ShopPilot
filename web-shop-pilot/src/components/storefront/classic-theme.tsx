'use client';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ProductModal } from './product-modal';
import { CartDrawer } from './cart-drawer';
import { useCartStore } from '@/lib/cart-store';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

interface ThemeProps {
  store: {
    name: string;
    about?: string;
    products: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
      description?: string;
      stock: number;
    }[];
    primaryColor?: string;
  };
}

export function ClassicTheme({ store }: ThemeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    stock: number;
  } | null>(null);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((acc, i) => acc + i.quantity, 0)
  );

  const filteredProducts = store.products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const primaryColor = store.primaryColor || '#000000';
  const heroGradient = `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)`;

  return (
    <div className="flex min-h-screen flex-col">
      <CartDrawer primaryColor={primaryColor} />

      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => toggleCart(true)}
          className="h-12 w-12 rounded-full shadow-lg transition-transform hover:scale-105 md:w-auto md:px-6"
          style={{ backgroundColor: primaryColor }}
        >
          <ShoppingCart className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Cart</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-black md:relative md:top-0 md:right-0 md:ml-2">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        primaryColor={primaryColor}
      />

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden py-20 lg:py-32"
        style={{ background: heroGradient }}
      >
        <div className="relative z-10 container mx-auto px-4 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl space-y-6"
          >
            <h1 className="text-foreground text-5xl font-extrabold tracking-tight md:text-7xl">
              {store.name}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed font-light md:text-2xl">
              {store.about || 'Discover our curated collection of premium products.'}
            </p>
            <div className="flex justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="h-12 rounded-full px-8 text-lg shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: primaryColor }}
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Decorative Blur */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-40 mix-blend-overlay blur-3xl" />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Our Collection</h2>
            <p className="text-muted-foreground mt-2">
              Found {filteredProducts.length} premium items
            </p>
          </div>
          <div className="w-full md:w-80">
            <Input
              placeholder="Search products..."
              className="bg-secondary/50 focus:bg-background h-12 rounded-full border-transparent px-6 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-gray-50 py-20 text-center">
            <p className="text-muted-foreground text-xl">No products match your search.</p>
            <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2 text-lg">
              Clear Search
            </Button>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer"
              >
                <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl || ''}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="text-muted-foreground/30 flex h-full items-center justify-center font-medium">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-sm"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.stock < 5 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-3 left-3 shadow-sm">
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-2">
                      <h3 className="group-hover:text-primary line-clamp-1 text-lg leading-tight font-bold transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2 h-10 text-sm">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-2xl font-bold tracking-tight">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className="rounded-full px-4 shadow-sm transition-all hover:shadow-md active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
