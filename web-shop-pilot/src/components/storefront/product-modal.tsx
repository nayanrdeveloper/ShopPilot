'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Check, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  primaryColor?: string;
}

import { useCartStore } from '@/lib/cart-store';
import Image from 'next/image';

export function ProductModal({
  product,
  isOpen,
  onClose,
  primaryColor = '#000000',
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose(); // Close modal
      toggleCart(true); // Open cart drawer
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-[800px]">
        <div className="flex h-full flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative aspect-square w-full bg-gray-50 md:aspect-auto md:w-1/2">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No Image
              </div>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Details Section */}
          <div className="flex w-full flex-col justify-between p-6 md:w-1/2 md:p-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl leading-tight font-bold text-gray-900">{product.name}</h2>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-muted-foreground ml-1 text-xs">(4.9)</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mt-2 -mr-2 rounded-full"
                  onClick={onClose}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                </Button>
              </div>

              <p className="text-sm leading-relaxed text-gray-500">
                {product.description || 'No description available for this product.'}
              </p>

              <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border bg-gray-50">
                  <button
                    className="flex h-10 w-10 items-center justify-center text-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    className="flex h-10 w-10 items-center justify-center text-lg font-medium hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  >
                    +
                  </button>
                </div>
                <span className="text-muted-foreground text-sm">{product.stock} available</span>
              </div>

              <Button
                size="lg"
                className="h-12 w-full rounded-full text-base shadow-lg transition-all active:scale-95"
                style={{ backgroundColor: isAdded ? '#10b981' : primaryColor }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center"
                    >
                      <Check className="mr-2 h-5 w-5" /> Added to Cart
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart - $
                      {(product.price * quantity).toFixed(2)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
              {product.stock === 0 && (
                <p className="text-center text-sm font-medium text-red-500">Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
