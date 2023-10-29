const express = require('express')
const router = express.Router()
// const authController = require('../controllers/auth') 
const mainController = require('../controllers/main')
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', mainController.getIndex)
router.get('/cashflow/:account', mainController.getEvents) /* how do I add as-of date? */
router.get('/getEvent', mainController.getEvent)
router.post('/postEvent', mainController.postEvent)
router.put('/putEvent', mainController.putEvent)
// router.put('/putEvents', mainController.putEvents)

// router.get('/login', authController.getLogin)
// router.post('/login', authController.postLogin)
// router.get('/logout', authController.logout)
// router.get('/signup', authController.getSignup)
// router.post('/signup', authController.postSignup)

module.exports = router