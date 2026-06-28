const mongoose = require('mongoose')

const plaidItemSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  accessToken: { type: String, required: true },
  itemId: { type: String, required: true },
  institutionId: String,
  institutionName: String,
  cursor: String,
}, { timestamps: true })

module.exports = mongoose.model('PlaidItem', plaidItemSchema)
