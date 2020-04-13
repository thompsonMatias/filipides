const { ApolloError } = require('apollo-server-express');


const ThirdInternalApiError = (msg) => new ApolloError(msg, "THIRD_INT_API_ERR");

module.exports = {
  ThirdInternalApiError,
};
