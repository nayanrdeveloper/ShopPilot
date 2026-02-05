'use client';

import Image from 'next/image';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface CartDrawerProps {
  primaryColor?: string;
}

export function CartDrawer({ primaryColor = '#000000' }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, isOpen, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Your Cart
            <Badge variant="secondary" className="ml-2 rounded-full px-2">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center opacity-50">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
              <Button
                variant="link"
                onClick={() => toggleCart(false)}
                style={{ color: primaryColor }}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className="flex items-start gap-4 bg-white"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 text-sm font-medium">{item.name}</h4>
                      <p className="mt-1 text-sm font-bold">${item.price.toFixed(2)}</p>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-8 items-center rounded-md border shadow-sm">
                          <button
                            className="flex h-full w-8 items-center justify-center text-gray-500 hover:bg-gray-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-full w-8 items-center justify-center text-gray-500 hover:bg-gray-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t bg-gray-50/50 p-6">
            <div className="flex items-center justify-between text-base font-medium">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              className="h-12 w-full rounded-xl text-lg shadow-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Checkout Now
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
