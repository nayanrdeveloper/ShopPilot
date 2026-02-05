import { ProductService } from '../services/product.service';

export const productResolvers = {
  Query: {
    hello: () => 'Hello Shop Pilot!',
    products: async (_: any, { skip, take, storeId }: { skip?: number; take?: number; storeId?: string }) => {
      return await ProductService.getAll(skip, take, storeId);
    },
    product: async (_: any, { id }: { id: string }) => {
      return await ProductService.getById(id);
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      args: {
        name: string;
        price: number;
        sku: string;
        storeId: string;
        stock?: number;
        description?: string;
        imageUrl?: string;
      },
    ) => {
      return await ProductService.create(args);
    },
    updateProduct: async (_: any, args: { id: string } & any) => {
      const { id, ...data } = args;
      return await ProductService.update(id, data);
    },
  },
};
