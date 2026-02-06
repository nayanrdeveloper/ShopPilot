import prisma from '../prisma/client';

export const OrderService = {
  createOrder: async (
    storeId: string,
    items: { productId: string; quantity: number }[],
    customerDetails: { name: string; email: string; address: string },
  ) => {
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      total += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    return await prisma.order.create({
      data: {
        storeId,
        total,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        shippingAddress: customerDetails.address,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });
  },

  getAll: async (storeId: string, skip: number = 0, take: number = 10) => {
    return await prisma.order.findMany({
      where: { storeId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  updateStatus: async (orderId: string, status: string) => {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
  },

  getSalesChartData: async (storeId: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    const salesByDate: Record<string, { date: string; revenue: number; orders: number }> = {};

    // Initialize last 7 days with 0
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      salesByDate[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (salesByDate[dateStr]) {
        salesByDate[dateStr].revenue += order.total;
        salesByDate[dateStr].orders += 1;
      }
    });

    return Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date));
  },
};
