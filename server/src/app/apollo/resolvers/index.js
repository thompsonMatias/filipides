const
  { merge } = require('lodash'),
  meetup = require('./meetup/meetup.resolver'),
  notification = require('./notification/notification.resolver'),
  user = require('./user/user.resolver'),
  weather = require('./weather/weather.resolver'),
  scalar = require('./scalars/scalar.resolver');


exports.resolvers = merge(
  {},
  scalar,
  meetup,
  notification,
  user,
  weather,
);
