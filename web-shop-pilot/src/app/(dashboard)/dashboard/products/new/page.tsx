'use client';

import { ProductForm } from '@/components/dashboard/product-form';
import { Separator } from '@/components/ui/separator';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create Product</h2>
        <p className="text-muted-foreground">
          Add a new product to your store. Use AI to generate descriptions.
        </p>
      </div>
      <Separator />
      <ProductForm />
    </div>
  );
}
