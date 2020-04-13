const
  { ApolloServer, AuthenticationError } = require('apollo-server-express'),
  { schemas } = require('app/apollo/schemas'),
  { resolvers } = require('app/apollo/resolvers'),
  { mergeSchemas } = require('apollo-server'),
  dataSources = require('app/apis'),
  { setCategory } = require('app/utils/logEnv'),
  jwt = require('jsonwebtoken'),
  logger = require('log4js').getLogger(setCategory('apolloClient'));

// TODO: Obtener del sensitive.conf
const SECRET_KEY = 'secret!';

exports.initApollo = (app, httpServer) => {
  const apolloServer = new ApolloServer({
    schema: mergeSchemas({schemas, resolvers}),
    dataSources: () => dataSources,
    context: ({req, connection}) => {
      if(connection) return {};

      const accessToken = req.cookies['jwt'] || '';

      try {
        return { role, data } = jwt.verify(accessToken, SECRET_KEY)
      } catch (e) {
        return {role: "guest"};
      }
    },
    playground: true,
    subscriptions: {
      path: process.env.APOLLO_PATH,
      onConnect: (connectionParams, webSocket) => {
        logger.info("Connected to Apollo Subscription WebSocket");
      },
    },
    onHealthCheck: () => Promise.resolve(),
  });

  apolloServer.applyMiddleware({app, path: process.env.APOLLO_PATH, cors: false});
  apolloServer.installSubscriptionHandlers(httpServer);

  logger.info(`🚀 Apollo Normal server ready at http://${process.env.DOMAIN_BACK}${process.env.APOLLO_PATH}`);
  logger.info(`🚀 Apollo PubSub server ready at ws://${process.env.DOMAIN_BACK}${apolloServer.subscriptionsPath}`);
};
