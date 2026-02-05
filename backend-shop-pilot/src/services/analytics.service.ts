import prisma from '../prisma/client';

export const AnalyticsService = {
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
                price: product.price
            });
        }

        return await prisma.order.create({
            data: {
                storeId,
                total,
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });
    },

    getSalesData: async (storeId: string) => {
        // 1. Total Revenue
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: { items: { include: { product: true } } }
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
            select: { name: true, stock: true }
        });

        return {
            totalRevenue,
            totalOrders,
            topSelling,
            lowStock: lowStockProducts.map((p: any) => `${p.name} (${p.stock} left)`)
        };
    }
};
