const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  name: { type: String, required: true },
  color: { type: String, default: '#7b61ff' },
  icon: { type: String, default: '' },
  budget: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)
