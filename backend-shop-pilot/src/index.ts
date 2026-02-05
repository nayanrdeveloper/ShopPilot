import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { typeDefs } from './schema/typeDefs';
import { resolvers as productResolvers } from './resolvers/product.resolver';
import { storeResolvers } from './resolvers/store.resolver';
import { aiResolvers } from './resolvers/ai.resolver';

// Merge resolvers
const resolvers = {
    Query: { ...productResolvers.Query, ...storeResolvers.Query },
    Mutation: { ...productResolvers.Mutation, ...storeResolvers.Mutation, ...aiResolvers.Mutation },
    Store: storeResolvers.Store,
};

interface MyContext {
    token?: string;
}

async function startApolloServer() {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const token = req.headers.token;
                return { token: Array.isArray(token) ? token[0] : token };
            },
        }),
    );

    const PORT = 4000;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch((err) => {
    console.error("Error starting server:", err);
});
