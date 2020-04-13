const
  { GraphQLScalarType, Kind } = require('graphql'),
  { GraphQLJSON } = require('graphql-type-json'),
  GraphQLDate = require('graphql-date'),
  { setCategory } = require('app/utils/logEnv'),
  logger = require('log4js').getLogger(setCategory('apollo.scalar.resolver'));


module.exports = {
  Object: GraphQLJSON,
  // Date: GraphQLDate,
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null;
    },
  })
};
