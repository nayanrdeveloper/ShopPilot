import prisma from '../prisma/client';

export const StoreService = {
  create: async (name: string, slug: string) => {
    return await prisma.store.create({
      data: {
        name,
        slug,
      },
    });
  },

  update: async (id: string, data: any) => {
    return await prisma.store.update({
      where: { id },
      data,
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
