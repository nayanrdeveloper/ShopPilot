"use client";

import { useQuery, gql } from "@apollo/client";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Package, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

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
        fetchPolicy: "network-only"
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
                    <p className="text-muted-foreground">
                        Manage your inventory and catalog here.
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search products..." className="pl-8 bg-background" />
                </div>
            </div>

            {/* Products Grid/Table */}
            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-xl border bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500">Error loading products: {error.message}</div>
            ) : products.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
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
                    {products.map((product: any) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video w-full bg-muted relative">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50">
                                        <Package className="h-10 w-10 opacity-20" />
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                                <CardDescription className="line-clamp-2 text-xs mt-1">
                                    {product.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex items-center justify-between">
                                <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                                <div className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock} in stock
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
