const { json } = require('express')
const morgan = require('morgan')

module.exports = function (app) {
	app.use(json())
	app.use(morgan('dev'))

	app.use('/api/v1', require('../routes'))
}
