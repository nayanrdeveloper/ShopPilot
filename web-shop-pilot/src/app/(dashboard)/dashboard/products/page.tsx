'use client';

import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Package, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const GET_PRODUCTS = gql`
  query GetProducts($storeId: ID!) {
    products(storeId: $storeId) {
      id
      name
      description
      price
      sku
      stock
      imageUrl
    }
  }
`;

export default function ProductsPage() {
  const store = useAuthStore((state) => state.store);
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { storeId: store?.id },
    skip: !store?.id,
    fetchPolicy: 'network-only',
  });

  if (!store) {
    return <div className="p-8 text-center">Store not found. Please log in again.</div>;
  }

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your inventory and catalog here.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input type="search" placeholder="Search products..." className="bg-background pl-8" />
        </div>
      </div>

      {/* Products Grid/Table */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/20 h-64 animate-pulse rounded-xl border" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading products: {error.message}</div>
      ) : products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed py-16 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Package className="text-muted-foreground h-8 w-8" />
          </div>
          <CardTitle className="mb-2">No products yet</CardTitle>
          <CardDescription className="mb-6 max-w-sm">
            Get started by creating your first product. AI can help you write the description!
          </CardDescription>
          <Link href="/dashboard/products/new">
            <Button>Create Product</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(
            (product: {
              id: string;
              name: string;
              description: string;
              price: number;
              stock: number;
              imageUrl?: string;
            }) => (
              <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="bg-muted relative aspect-video w-full">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl || ''}
                      alt={product.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="text-muted-foreground bg-secondary/50 flex h-full items-center justify-center">
                      <Package className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 text-xs">
                    {product.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4 pt-0">
                  <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}
                  >
                    {product.stock} in stock
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
