'use client';

import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SalesAreaChart } from '@/components/dashboard/sales-area-chart';

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($storeId: ID!) {
    dashboardStats(storeId: $storeId) {
      totalRevenue
      totalOrders
      averageOrderValue
      lowStockCount
      totalProducts
    }
  }
`;

export default function DashboardPage() {
  const store = useAuthStore((state) => state.store);
  const user = useAuthStore((state) => state.user);

  const { data, loading } = useQuery(GET_DASHBOARD_STATS, {
    variables: { storeId: store?.id },
    skip: !store?.id,
  });

  if (!store) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Session Expired</h2>
        <p className="text-muted-foreground">Please log in to access your dashboard.</p>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    );
  }

  const stats = data?.dashboardStats;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's what's happening with{' '}
            <span className="text-primary font-semibold">{store.slug}</span> today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${stats?.totalRevenue.toFixed(2) || '0.00'}
                </div>
                <p className="text-muted-foreground mt-1 flex items-center text-xs">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> +20.1% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[80px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">+{stats?.totalOrders || 0}</div>
                <p className="text-muted-foreground mt-1 text-xs">+180.1% from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[80px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-muted-foreground mt-1 text-xs">Active in catalog</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[50px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.lowStockCount || 0}</div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Items typically need restocking
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesAreaChart />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardContent>
              <div className="space-y-4 pt-4">
                <div className="flex items-center">
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <div className="ml-2 space-y-1">
                    <p className="text-sm leading-none font-medium">New Order #1024</p>
                    <p className="text-muted-foreground text-xs">Just now</p>
                  </div>
                  <div className="ml-auto font-medium">+$250.00</div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="ml-2 space-y-1">
                    <p className="text-sm leading-none font-medium">New Customer Registered</p>
                    <p className="text-muted-foreground text-xs">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div className="ml-2 space-y-1">
                    <p className="text-sm leading-none font-medium">Low Stock Warning</p>
                    <p className="text-muted-foreground text-xs">Product: Wireless Headphones</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
