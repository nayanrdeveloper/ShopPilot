import prisma from '../prisma/client';

export const ProductService = {
    getAll: async (skip: number = 0, take: number = 10, storeId?: string) => {
        return await prisma.product.findMany({
            skip,
            take,
            where: storeId ? { storeId } : {},
            orderBy: { createdAt: 'desc' },
        });
    },

    getById: async (id: string) => {
        return await prisma.product.findUnique({
            where: { id },
        });
    },

    create: async (data: { name: string; price: number; sku: string; storeId: string; stock?: number; description?: string; imageUrl?: string }) => {
        try {
            return await prisma.product.create({
                data,
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error(`Product with SKU '${data.sku}' already exists.`);
            }
            throw error;
        }
    },
    update: async (id: string, data: any) => {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }
};
