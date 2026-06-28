const mongoose = require('mongoose')

const recurringSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, default: 'monthly' },
  categoryId: String,
}, { timestamps: true })

module.exports = mongoose.model('Recurring', recurringSchema)
