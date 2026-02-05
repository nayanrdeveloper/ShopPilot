export const typeDefs = `#graphql
  type Store {
    id: ID!
    name: String!
    slug: String!
    products: [Product!]
    createdAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    sku: String!
    stock: Int!
    imageUrl: String
    active: Boolean!
    storeId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    hello: String
    products(skip: Int, take: Int): [Product!]!
    store(slug: String!): Store
    stores: [Store!]!
    product(id: ID!): Product
  }

  type AuthPayload {
    token: String!
    user: User!
    store: Store!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Mutation {
    createStore(name: String!, slug: String!): Store!
    createProduct(name: String!, price: Float!, sku: String!, storeId: String!, stock: Int, description: String, imageUrl: String): Product!
    updateProduct(id: ID!, name: String, price: Float, stock: Int, description: String, imageUrl: String, active: Boolean): Product!
    generateDescription(name: String!, category: String!): String!
    createOrder(storeId: ID!, items: [OrderItemInput!]!): Order!
    generateSalesSummary(storeId: ID!): String!
    
    register(email: String!, password: String!, name: String!, storeName: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  type Order {
    id: ID!
    total: Float!
    status: String!
    createdAt: String!
  }
`;
