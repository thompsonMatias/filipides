const { gql, makeExecutableSchema } = require('apollo-server');


module.exports = makeExecutableSchema({
  typeDefs: gql`
    scalar Object
    
    scalar Date
  `
});
