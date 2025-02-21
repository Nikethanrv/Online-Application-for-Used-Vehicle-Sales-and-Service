const express = require('express')
const router = express.Router()

const user_profile_register = require('../controllers/user')

router.post('/reg', user_profile_register.register)
router.post('/login', user_profile_register.login)
router.post('/update', user_profile_register.updateAcc)
router.post('/delete', user_profile_register.deleteAcc)

module.exports = router