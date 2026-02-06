'use client';

import { use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ slug: string; orderId: string }>;
}) {
  const { slug, orderId } = use(params);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Order Confirmed!</h1>
        <p className="mb-8 text-gray-500">
          Thank you for your purchase. Your order{' '}
          <span className="font-mono font-bold text-gray-700">#{orderId.slice(0, 8)}</span> has been
          received.
        </p>

        <div className="space-y-3">
          <Link href={`/${slug}`}>
            <Button className="h-11 w-full rounded-full text-base" size="lg">
              Continue Shopping
            </Button>
          </Link>
          {/* Future: View Order Details link */}
        </div>
      </motion.div>
    </div>
  );
}
