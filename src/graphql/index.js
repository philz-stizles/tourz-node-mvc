/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer, gql } = require('apollo-server-express');
const { BaseRedisCache } = require('apollo-server-cache-redis');
const Redis = require('ioredis');
const { graphqlUploadExpress } = require('graphql-upload');
// GraphQL dependencies
const dataSources = require('./data-sources');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const formatError = require('./error');
const context = require('./context');

const initGraphQL = async (app, server) => {
  // If your server is deployed to an environment where NODE_ENV is set to production,
  // GraphQL Playground and introspection are disabled by default. To enable them,
  // set playground: true and introspection: true
  // https://studio.apollographql.com/sandbox/explorer
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = new ApolloServer({
    schema,
    // When running multiple instances of your server, you should use a shared cache backend.
    // This enables one server instance to use the cached result from another instance.
    cache: new BaseRedisCache({
      client: new Redis({
        host: process.env.REDIS_GRAPHQL_HOST,
      }),
    }),
    context,
    formatError, // Error formatting
    dataSources, // DataSource - MongoDB
    introspection: true,
    playground:
      process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    uploads: false,
  });
  // Configure GraphQL Subscriptions
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(_connectionParams, _webSocket, _context) {
        console.log('Connected!');
      },
      onDisconnect(_webSocket, _context) {
        console.log('Disconnected!');
      },
    },
    { server, path: apolloServer.graphqlPath }
  );
  // apolloServer.installSubscriptionHandlers(server); // This enables a websocket
  // to be used for graphql. You then need to add graphql-subscriptions
  app.use(
    graphqlUploadExpress({
      maxFieldSize: 1000000, // Maximum allowed non-file multipart form field size in bytes; enough for your queries.
      maxFileSize: 10000, // Maximum allowed file size in bytes.
      maxFiles: 5, // Maximum allowed number of files.
    })
  );

  // Wait for server to start up
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `🚀 GraphQL playground @ http://localhost:${process.env.PORT}/graphql`
    );
  }
};

module.exports = initGraphQL;
