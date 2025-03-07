const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userRijdenxSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

userRijdenxSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserRijdenx', userRijdenxSchema);
