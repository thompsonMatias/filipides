const { gql, makeExecutableSchema } = require('apollo-server');


module.exports = makeExecutableSchema({
  typeDefs: gql`    
    type Query {
      getUser(_id: String!): User!
      getUsers: [User]!
    }
  
    type Mutation {
      # createUser(createUserInput: createUserInput!): Boolean!
      updateUser(updateUserInput: UpdateUserInput!): Boolean!
      # deleteUser(deleteUserInput: deleteUserInput!): Boolean!
      updateUserAsAdmin(_id: String!): Boolean!
    }
    
    type User{
      _id: String!
      name: String!
      email: String!
      admin: Boolean!
    }
    
    input UpdateUserInput{
      _id: String!
      name: String
      admin: Boolean
      password: String
    }
    
    scalar Object
  `
});
