const router = require('express').Router()
const Recurring = require('../models/Recurring')

router.get('/', async (req, res) => {
  const items = await Recurring.find({ uid: req.uid })
  res.json(items)
})

router.post('/', async (req, res) => {
  const item = await Recurring.create({ ...req.body, uid: req.uid })
  res.status(201).json(item)
})

router.put('/:id', async (req, res) => {
  const item = await Recurring.findOneAndUpdate({ _id: req.params.id, uid: req.uid }, req.body, { new: true })
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

router.delete('/:id', async (req, res) => {
  await Recurring.findOneAndDelete({ _id: req.params.id, uid: req.uid })
  res.status(204).end()
})

module.exports = router
