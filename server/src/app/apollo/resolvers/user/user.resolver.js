const
  { User } = require('app/models'),
  { errors } = require('app/apollo/exeptions'),
  { AuthenticationError } = require('apollo-server'),
  bcrypt = require('bcryptjs'),
  { setCategory } = require('app/utils/logEnv'),
  logger = require('log4js').getLogger(setCategory('apollo.user.resolver'));

module.exports = {
  Query: {

    getUser: (obj, {_id, ...args}, {user, dataSources: {WeatherAPI}, ...context}) =>
      new Promise((resolve, reject) => {
        // !user && reject(new AuthenticationError('must authenticate'));

        User.findOne({_id})
          .then(res => resolve(res))
          .catch(err => reject(err));
      }),

    getUsers: (obj, args, {user, ...context}) =>
      new Promise((resolve, reject) => {
        // if(!user.verified) reject(new AuthenticationError('must authenticate'));

        User.find()
          .then(res => resolve(res))
          .catch(err => reject(err));
      }),

  },
  Mutation: {

    // createUser: (obj, {inputUser, ...args}, {user, ...context}) =>
    //   new Promise((resolve, reject) => {
    //     // if(!user.verified) reject(new AuthenticationError('must authenticate'));
    //
    //     User.findOneAndUpdate(...User.queries.createUser(user.data.userPrincipalName, inputUser))
    //       .then(res => resolve(true))
    //       .catch(err => reject(err));
    //   }),

    updateUser: (obj, {updateUserInput, ...args}, {user, ...context}) =>
      new Promise(async (resolve, reject) => {
        // if(!user.verified) reject(new AuthenticationError('must authenticate'));

        const { _id } = updateUserInput;
        if(updateUserInput["password"]){
          updateUserInput["password"] = await bcrypt.hash(updateUserInput["password"], 10);
        }

        User.findOneAndUpdate({_id}, updateUserInput)
          .then(res => resolve(true))
          .catch(err => reject(err));
      }),

    updateUserAsAdmin: (obj, {_id, ...args}, {user, ...context}) =>
      new Promise(async (resolve, reject) => {
        // if(!user.verified) reject(new AuthenticationError('must authenticate'));

        User.findOneAndUpdate({_id}, {admin: true})
          .then(res => resolve(true))
          .catch(err => reject(err));
      }),

    // deleteUser: (obj, args, {user, ...context}) =>
    //   new Promise((resolve, reject) => {
    //     // if(!user.verified) reject(new AuthenticationError('must authenticate'));
    //
    //     User.deleteOne(...User.queries.deleteUser(user.data.userPrincipalName))
    //       .then(res => resolve(true))
    //       .catch(err => reject(err));
    //   }),

  },
};
