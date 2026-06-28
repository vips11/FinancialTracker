const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  categoryId: String,
  date: { type: String, required: true },
  note: String,
  source: { type: String, default: 'manual' },
  accountId: String,
  merchantName: String,
  pending: { type: Boolean, default: false },
  recurring: { type: Boolean, default: false },
  plaidTransactionId: { type: String, index: true, sparse: true },
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
