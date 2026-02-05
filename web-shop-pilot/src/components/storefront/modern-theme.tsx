'use client';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, Zap, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductModal } from './product-modal';
import { CartDrawer } from './cart-drawer';
import { useCartStore } from '@/lib/cart-store';

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

export function ModernTheme({ store }: ThemeProps) {
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
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

      {/* Modern Header / Hero Block */}
      <section className="w-full text-white" style={{ backgroundColor: primaryColor }}>
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl space-y-4 text-center md:text-left">
              <h1 className="text-4xl leading-tight font-bold md:text-6xl">{store.name}</h1>
              {store.about && (
                <p className="text-lg font-medium opacity-90 md:text-xl">{store.about}</p>
              )}
              <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-semibold opacity-80 md:justify-start">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Verified Seller
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4" /> Fast Delivery
                </span>
              </div>
            </div>

            {/* Search Bar Floating in Header */}
            <div className="flex w-full items-center rounded-lg bg-white p-2 shadow-lg md:w-96">
              <Search className="ml-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for products..."
                className="h-10 border-0 text-gray-800 shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto -mt-8 px-4 py-12">
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl bg-white py-20 text-center shadow-sm">
            <p className="text-xl text-gray-500">No products match your search.</p>
            <Button variant="link" onClick={() => setSearchTerm('')} className="text-primary mt-2">
              View All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer"
              >
                <Card className="h-full overflow-hidden rounded-xl border-0 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="relative aspect-square">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl || ''}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                        No Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/5" />
                  </div>

                  <CardContent className="p-4">
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900 md:text-base">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Price</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full shadow-md md:h-10 md:w-10"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ShoppingCart className="h-4 w-4 text-white md:h-5 md:w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-auto py-8 text-center text-sm text-gray-400">
        <p>Verified by ShopPilot</p>
      </footer>
    </div>
  );
}
