import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
dotenv.config();

import { typeDefs } from './schema/typeDefs';
import { productResolvers } from './resolvers/product.resolver';
import { storeResolvers } from './resolvers/store.resolver';
import { aiResolvers } from './resolvers/ai.resolver';
import { authResolvers } from './resolvers/auth.resolver';
import { orderResolvers } from './resolvers/order.resolver';
import { context, Context } from './context';

// Merge resolvers
const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...storeResolvers.Query,
    ...authResolvers.Query,
    ...orderResolvers.Query,
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...storeResolvers.Mutation,
    ...aiResolvers.Mutation,
    ...authResolvers.Mutation,
    ...orderResolvers.Mutation,
  },
  Store: storeResolvers.Store,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: context,
  });

  console.log(`🚀 Server ready at ${url}`);
}

main();
