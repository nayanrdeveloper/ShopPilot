'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@/lib/store';
import { Loader2, TrendingUp } from 'lucide-react';

const GET_SALES_DATA = gql`
  query GetSalesData($storeId: ID!) {
    salesChartData(storeId: $storeId) {
      date
      revenue
      orders
    }
  }
`;

export function SalesAreaChart() {
  const store = useAuthStore((state) => state.store);
  const { data, loading, error } = useQuery(GET_SALES_DATA, {
    variables: { storeId: store?.id },
    skip: !store?.id,
  });

  if (loading) {
    return (
      <Card className="col-span-4 flex h-[400px] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </Card>
    );
  }

  if (error || !data?.salesChartData) {
    return (
      <Card className="col-span-4 flex h-[400px] items-center justify-center text-red-500">
        Failed to load chart data
      </Card>
    );
  }

  const chartData = data.salesChartData.map((item: any) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));

  // Calculate trends
  const totalRevenue = chartData.reduce((acc: number, item: any) => acc + item.revenue, 0);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          Total Revenue in 7 days:{' '}
          <span className="text-foreground font-bold">${totalRevenue.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => `$${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
