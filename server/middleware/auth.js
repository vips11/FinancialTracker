const { initializeApp, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID })

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = await getAuth().verifyIdToken(token)
    req.uid = decoded.uid
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}
