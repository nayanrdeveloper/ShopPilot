import { AuthService } from '../services/auth.service';
import prisma from '../prisma/client';

export const authResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return await prisma.user.findUnique({
        where: { id: context.user.userId },
      });
    },
  },
  Mutation: {
    register: async (_: any, { email, password, name, storeName }: any) => {
      return await AuthService.register(email, password, name, storeName);
    },
    login: async (_: any, { email, password }: any) => {
      return await AuthService.login(email, password);
    },
  },
};
