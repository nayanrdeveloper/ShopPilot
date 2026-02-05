import prisma from '../prisma/client';

export const StoreService = {
  create: async (name: string, slug: string) => {
    return await prisma.store.create({
      data: { name, slug },
    });
  },

  getBySlug: async (slug: string) => {
    return await prisma.store.findUnique({
      where: { slug },
      include: { products: true }, // Include products for that store
    });
  },

  getAll: async () => {
    return await prisma.store.findMany();
  },
};
