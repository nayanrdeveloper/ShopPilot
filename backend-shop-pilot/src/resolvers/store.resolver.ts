import { StoreService } from '../services/store.service';
import { ProductService } from '../services/product.service';

export const storeResolvers = {
  Query: {
    stores: async () => {
      return await StoreService.getAll();
    },
    store: async (_: any, { slug }: { slug: string }) => {
      return await StoreService.getBySlug(slug);
    },
  },
  Mutation: {
    createStore: async (_: any, { name, slug }: { name: string; slug: string }) => {
      return await StoreService.create(name, slug);
    },
  },
  // Field Resolver for Store
  Store: {
    products: async (parent: any) => {
      // Fetch products for this specific store
      return await ProductService.getAll(0, 100, parent.id);
    },
  },
};
