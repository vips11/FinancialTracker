const router = require('express').Router()
const Category = require('../models/Category')

router.get('/', async (req, res) => {
  const cats = await Category.find({ uid: req.uid })
  res.json(cats)
})

router.post('/', async (req, res) => {
  const cat = await Category.create({ ...req.body, uid: req.uid })
  res.status(201).json(cat)
})

router.put('/:id', async (req, res) => {
  const cat = await Category.findOneAndUpdate({ _id: req.params.id, uid: req.uid }, req.body, { new: true })
  if (!cat) return res.status(404).json({ error: 'Not found' })
  res.json(cat)
})

router.delete('/:id', async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, uid: req.uid })
  res.status(204).end()
})

module.exports = router
