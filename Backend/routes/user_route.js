const express = require('express')
const router = express.Router()

const user_profile = require('../controllers/user')

router.post('/reg', user_profile.register)
router.post('/login', user_profile.login)
router.put('/update', user_profile.updateAcc)
router.post('/delete', user_profile.deleteAcc)
router.get('/details/:userId', user_profile.getUserDetails)
router.get('/profile/:userId', user_profile.userProfile)

module.exports = router