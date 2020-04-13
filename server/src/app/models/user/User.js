const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;


const User = new Schema({
  _id:  {type: Schema.Types.String},
  name:  {type: Schema.Types.String},
  email:  {type: Schema.Types.String},
  admin:  {type: Schema.Types.Boolean},
  password: {type: Schema.Types.String},
}, {
  minimize: false,
  versionKey: false,
});

const model = mongoose.model('users', User, 'users');

module.exports = model;
