const jwt = require('jsonwebtoken')

const jwtPrivateKey = 'cocacola'

module.exports = (req, res, next) => {
	const token = req.headers['x-auth-token']

	if (!token)
		return res.status(401).json({ message: 'Usuario no autenticado' })

	try {
		const decoded = jwt.verify(token, jwtPrivateKey)

		req.user = decoded

		next()
	} catch (err) {
		console.log(err)

		res.status(400).json({ message: 'invalid token' })
	}
}
