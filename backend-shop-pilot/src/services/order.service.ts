import prisma from '../prisma/client';

export const OrderService = {
  createOrder: async (storeId: string, items: { productId: string; quantity: number }[]) => {
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
};
