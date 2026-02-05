import { AuthService } from '../services/auth.service';

export const authResolvers = {
    Mutation: {
        register: async (_: any, { email, password, name, storeName }: any) => {
            return await AuthService.register(email, password, name, storeName);
        },
        login: async (_: any, { email, password }: any) => {
            return await AuthService.login(email, password);
        }
    }
};
