const express = require('express')

const crypto = require('crypto')

const app = express()

app.use(express.json())

const usersDB = {}

app.post('/register', (req, res) => {
	const { username, password: passwordPlainText } = req.body

	if (usersDB[username])
		return res.status(400).json({
			message:
				'Se ha producido un error al registrar usuario vuelve a intentarlo',
		})

	const password = crypto
		.createHash('sha1')
		.update(passwordPlainText)
		.digest('hex')

	usersDB[username] = { username, password }

	console.log({ usersDB })

	res.status(201).json({ message: 'Usuario registrado.' })
})

app.post('/login', (req, res) => {
	const { username, password: passwordPlainText } = req.body

	if (!usersDB[username])
		return res
			.status(400)
			.json({ message: 'Usuario y contraseña invalidos' })

	const hashedPassword = crypto
		.createHash('sha1')
		.update(passwordPlainText)
		.digest('hex')

	const isAuth = usersDB[username].password === hashedPassword

	if (!isAuth)
		return res
			.status(400)
			.json({ message: 'Usuario y contraseña invalidos' })

	res.status(201).json({ message: 'Usuario logado.' })
})

app.listen(3000, () => console.log('SERVER ON'))
