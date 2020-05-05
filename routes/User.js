const express= require('express')
const router = express.Router()
const userControllers = require('../controllers/User')

router.post('/register',userControllers.register)
router.post('/login',userControllers.authenticated)

module.exports = router