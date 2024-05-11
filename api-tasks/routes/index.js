const express = require('express')

const router = express.Router()

router.use('/ping', require('./testing'))
router.use('/tasks', require('./tasks'))
router.use(require('./users'))

module.exports = router
