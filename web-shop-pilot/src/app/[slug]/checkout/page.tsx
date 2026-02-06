'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $storeId: ID!
    $items: [OrderItemInput!]!
    $customerName: String!
    $customerEmail: String!
    $shippingAddress: String!
  ) {
    createOrder(
      storeId: $storeId
      items: $items
      customerName: $customerName
      customerEmail: $customerEmail
      shippingAddress: $shippingAddress
    ) {
      id
    }
  }
`;

const GET_STORE = gql`
  query GetStore($slug: String!) {
    store(slug: $slug) {
      id
      name
      primaryColor
    }
  }
`;

// Validation Schema
const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

import { useQuery } from '@apollo/client';
import { use } from 'react';

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  // Fetch store details to get ID
  const { data: storeData } = useQuery(GET_STORE, { variables: { slug } });
  const store = storeData?.store;

  const [createOrder, { loading }] = useMutation(CREATE_ORDER);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
    },
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!store?.id) return;

    try {
      const fullAddress = `${values.address}, ${values.city}, ${values.zipCode}, ${values.country}`;

      const { data } = await createOrder({
        variables: {
          storeId: store.id,
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          customerName: values.customerName,
          customerEmail: values.customerEmail,
          shippingAddress: fullAddress,
        },
      });

      if (data?.createOrder?.id) {
        clearCart();
        router.push(`/${slug}/checkout/success/${data.createOrder.id}`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const primaryColor = store?.primaryColor || '#000000';

  if (!store && !loading) return <div className="p-10 text-center">Loading store...</div>;
  if (!items.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-50 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500">Add looks like you haven't added anything to your cart yet.</p>
        <Link href={`/${slug}`}>
          <Button style={{ backgroundColor: primaryColor }}>Return to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/${slug}`}
          className="mb-8 flex w-fit items-center text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="mt-2 text-gray-500">Complete your order with {store?.name}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Details</CardTitle>
                <CardDescription>Enter your delivery information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="mt-4 h-12 w-full text-lg font-medium shadow-lg transition-all hover:brightness-110"
                      style={{ backgroundColor: primaryColor }}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:pl-8">
            <div className="sticky top-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
              <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-gray-100 py-3 last:border-0"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                          No Img
                        </div>
                      )}
                      <span className="absolute top-0 right-0 rounded-bl-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-dashed border-gray-200 pt-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between pt-3 text-xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
