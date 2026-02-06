'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Eye, MapPin, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';

const GET_ORDERS = gql`
  query GetOrders($storeId: ID!, $skip: Int, $take: Int) {
    orders(storeId: $storeId, skip: $skip, take: $take) {
      id
      customerName
      customerEmail
      shippingAddress
      total
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          name
          imageUrl
        }
      }
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const store = useAuthStore((state) => state.store);
  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: { storeId: store?.id, skip: 0, take: 50 },
    skip: !store?.id,
    pollInterval: 10000,
  });

  const [updateStatus, { loading: updating }] = useMutation(UPDATE_STATUS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({
        variables: { id: orderId, status: newStatus },
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading orders</div>;
  }

  const orders =
    data?.orders.filter(
      (order: any) =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your store orders and status.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              className="w-[200px] pl-9 lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>You have {orders.length} orders total.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customerName || 'Guest'}</span>
                          <span className="text-muted-foreground text-xs">
                            {order.customerEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(parseInt(order.createdAt)), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                          disabled={updating}
                        >
                          <SelectTrigger
                            className={`h-8 w-[130px] ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Order Details #{order.id.slice(0, 8)}</SheetTitle>
                              <SheetDescription>
                                Placed on {format(new Date(parseInt(order.createdAt)), 'PPP p')}
                              </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                              {/* Customer Info */}
                              <div className="bg-muted/50 rounded-lg p-4">
                                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                  <MapPin className="h-4 w-4" /> Shipping Address
                                </h3>
                                <p className="text-sm">{order.customerName}</p>
                                <p className="text-muted-foreground text-sm">
                                  {order.customerEmail}
                                </p>
                                <p className="mt-2 text-sm whitespace-pre-line">
                                  {order.shippingAddress}
                                </p>
                              </div>

                              {/* Items List */}
                              <div>
                                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                                  <Package className="h-4 w-4" /> Order Items
                                </h3>
                                <div className="space-y-4">
                                  {order.items.map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center gap-4 rounded-lg border p-3"
                                    >
                                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                                        {item.product.imageUrl ? (
                                          <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                            No Img
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-sm font-medium">{item.product.name}</h4>
                                        <p className="text-muted-foreground text-xs">
                                          Qty: {item.quantity} × ${item.price}
                                        </p>
                                      </div>
                                      <div className="text-sm font-semibold">
                                        ${(item.quantity * item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Summary */}
                              <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                  <span>Total Amount</span>
                                  <span>${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
