import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

export interface UserContext {
    userId: string;
    storeId: string;
    role: string;
}

export interface Context {
    user: UserContext | null;
}

export const getUserFromToken = (token: string): UserContext | null => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET) as UserContext;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const context = async ({ req }: { req: any }): Promise<Context> => {
    const token = req.headers.authorization || '';
    // Bearer <token>
    const actualToken = token.replace('Bearer ', '');
    const user = getUserFromToken(actualToken);
    return { user };
};

export const authenticated = (next: (parent: any, args: any, context: Context, info: any) => any) =>
    (parent: any, args: any, context: Context, info: any) => {
        if (!context.user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        return next(parent, args, context, info);
    };
