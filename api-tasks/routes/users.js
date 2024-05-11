const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { usersDB } = require('../db')

const auth = require('../middleware/auth')

const jwtPrivateKey = 'cocacola'

const router = express.Router()

async function hashPassword(passwordPlainText) {
	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(passwordPlainText, salt)

	return hash
}

function generateJWT(payload) {
	return jwt.sign(payload, jwtPrivateKey)
}

router.post('/register', async (req, res) => {
	const { username, password: passwordPlainText } = req.body

	if (usersDB[username])
		return res.status(400).json({
			message:
				'Se ha producido un error al registrar usuario vuelve a intentarlo',
		})

	const password = await hashPassword(passwordPlainText)

	usersDB[username] = { username, password }

	const token = generateJWT({ username })

	console.log({ usersDB, token })

	res.setHeader('x-auth-token', token)
	res.status(201).json({ message: 'Usuario registrado.' })
})

router.post('/login', async (req, res) => {
	const { username, password: passwordPlainText } = req.body

	if (!usersDB[username])
		return res
			.status(400)
			.json({ message: 'Usuario y contraseña invalidos' })

	const hashDB = usersDB[username].password

	const isAuth = await bcrypt.compare(passwordPlainText, hashDB)

	if (!isAuth)
		return res
			.status(400)
			.json({ message: 'Usuario y contraseña invalidos' })

	const token = generateJWT({ username })

	res.setHeader('x-auth-token', token)
	res.status(201).json({ message: 'Usuario logado.' })
})

router.get('/:username', auth, (req, res) => {
	const { username } = req.params

	if (req.user.username !== username)
		return res.status(404).json({ message: 'User not found' })

	res.json({ message: req.user.username + "'s profile" })
})

module.exports = router
