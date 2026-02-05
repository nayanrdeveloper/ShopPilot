import { StoreService } from '../services/store.service';
import { ProductService } from '../services/product.service';
import { AnalyticsService } from '../services/analytics.service';

export const storeResolvers = {
  Query: {
    stores: async () => {
      return await StoreService.getAll();
    },
    dashboardStats: async (_: any, { storeId }: { storeId: string }) => {
      return await AnalyticsService.getDashboardStats(storeId);
    },
    store: async (_: any, { slug }: { slug: string }) => {
      return await StoreService.getBySlug(slug);
    },
  },
  Mutation: {
    createStore: async (_: any, { name, slug }: { name: string; slug: string }) => {
      return await StoreService.create(name, slug);
    },
    updateStore: async (_: any, { id, input }: { id: string; input: any }) => {
      return await StoreService.update(id, input);
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
