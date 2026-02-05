import prisma from '../prisma/client';

export const AnalyticsService = {
  getDashboardStats: async (storeId: string) => {
    const orders = await prisma.order.findMany({
      where: { storeId },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const lowStockCount = await prisma.product.count({
      where: { storeId, stock: { lt: 10 } },
    });

    const totalProducts = await prisma.product.count({
      where: { storeId },
    });

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      lowStockCount,
      totalProducts,
    };
  },

  getSalesData: async (storeId: string) => {
    // 1. Total Revenue
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: { items: { include: { product: true } } },
    });

    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const totalOrders = orders.length;

    // 2. Top Selling Products
    const productSales: Record<string, number> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const name = item.product.name;
        productSales[name] = (productSales[name] || 0) + item.quantity;
      });
    });

    const topSelling = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, qty]) => `${name} (${qty} sold)`);

    // 3. Low Stock (Real-time check)
    const lowStockProducts = await prisma.product.findMany({
      where: { storeId, stock: { lt: 10 } },
      select: { name: true, stock: true },
    });

    return {
      totalRevenue,
      totalOrders,
      topSelling,
      lowStock: lowStockProducts.map((p: any) => `${p.name} (${p.stock} left)`),
    };
  },
};
