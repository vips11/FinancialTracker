const router = require('express').Router()
const Settings = require('../models/Settings')

router.get('/', async (req, res) => {
  let settings = await Settings.findOne({ uid: req.uid })
  if (!settings) settings = await Settings.create({ uid: req.uid })
  res.json(settings)
})

router.put('/', async (req, res) => {
  const settings = await Settings.findOneAndUpdate({ uid: req.uid }, req.body, { new: true, upsert: true })
  res.json(settings)
})

module.exports = router
