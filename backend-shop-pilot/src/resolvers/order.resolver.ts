import { OrderService } from '../services/order.service';

export const orderResolvers = {
  Query: {
    orders: async (
      _: any,
      { storeId, skip, take }: { storeId: string; skip?: number; take?: number },
    ) => {
      return await OrderService.getAll(storeId, skip, take);
    },
  },
  Mutation: {
    createOrder: async (
      _: any,
      {
        storeId,
        items,
        customerName,
        customerEmail,
        shippingAddress,
      }: {
        storeId: string;
        items: any[];
        customerName: string;
        customerEmail: string;
        shippingAddress: string;
      },
    ) => {
      return await OrderService.createOrder(storeId, items, {
        name: customerName,
        email: customerEmail,
        address: shippingAddress,
      });
    },
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      return await OrderService.updateStatus(id, status);
    },
  },
};
