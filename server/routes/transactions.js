const router = require('express').Router()
const Transaction = require('../models/Transaction')

router.get('/', async (req, res) => {
  const txs = await Transaction.find({ uid: req.uid }).sort({ date: -1 })
  res.json(txs)
})

router.post('/', async (req, res) => {
  const tx = await Transaction.create({ ...req.body, uid: req.uid })
  res.status(201).json(tx)
})

router.put('/:id', async (req, res) => {
  const tx = await Transaction.findOneAndUpdate({ _id: req.params.id, uid: req.uid }, req.body, { new: true })
  if (!tx) return res.status(404).json({ error: 'Not found' })
  res.json(tx)
})

router.delete('/:id', async (req, res) => {
  await Transaction.findOneAndDelete({ _id: req.params.id, uid: req.uid })
  res.status(204).end()
})

module.exports = router
