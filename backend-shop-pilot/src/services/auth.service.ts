import prisma from '../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

export const AuthService = {
    register: async (email: string, password: string, name: string, storeName: string) => {
        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists with this email.');
        }

        // 2. Setup Store (check slug)
        const slug = storeName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const existingStore = await prisma.store.findUnique({ where: { slug } });
        if (existingStore) {
            throw new Error(`Store slug '${slug}' is already taken.`);
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Transaction: Create Store + User
        const result = await prisma.$transaction(async (tx) => {
            const store = await tx.store.create({
                data: {
                    name: storeName,
                    slug
                }
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    storeId: store.id,
                    role: 'OWNER'
                }
            });

            return { user, store };
        });

        // 5. Generate Token
        const token = jwt.sign(
            { userId: result.user.id, storeId: result.store.id, role: result.user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: result.user,
            store: result.store
        };
    },

    login: async (email: string, password: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { store: true }
        });

        if (!user) {
            throw new Error('Invalid email or password.');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid email or password.');
        }

        const token = jwt.sign(
            { userId: user.id, storeId: user.storeId, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user,
            store: user.store
        };
    }
};
