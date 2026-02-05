import { AiService } from '../services/ai.service';
import { AnalyticsService } from '../services/analytics.service';

export const aiResolvers = {
    Mutation: {
        generateDescription: async (_: any, { name, category }: { name: string; category: string }) => {
            return await AiService.generateDescription(name, category);
        },
        createOrder: async (_: any, { storeId, items }: { storeId: string; items: any[] }) => {
            return await AnalyticsService.createOrder(storeId, items);
        },
        generateSalesSummary: async (_: any, { storeId }: { storeId: string }) => {
            // 1. Refresh Analytics Data
            const data = await AnalyticsService.getSalesData(storeId);
            // 2. Pass to AI
            return await AiService.generateSalesSummary(data);
        },
    },
};
