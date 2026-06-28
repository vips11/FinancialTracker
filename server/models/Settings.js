const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  monthlyBudget: { type: Number, default: 0 },
  theme: { type: String, default: 'light' },
  monthlyBudgets: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

module.exports = mongoose.model('Settings', settingsSchema)
