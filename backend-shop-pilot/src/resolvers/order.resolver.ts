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
    createOrder: async (_: any, { storeId, items }: { storeId: string; items: any[] }) => {
      return await OrderService.createOrder(storeId, items);
    },
  },
};
