const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
});

module.exports = mongoose.model('order', orderSchema);
