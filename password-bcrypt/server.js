const express = require('express')

const bcrypt = require('bcrypt')

async function hashPassword(passwordPlainText) {
	const salt = await bcrypt.genSalt(10)

	const hash = await bcrypt.hash(passwordPlainText, salt)

	console.log({ salt, hash })

	return hash
}

const app = express()

app.use(express.json())

const usersDB = {}

app.post('/register', async (req, res) => {
	const { username, password: passwordPlainText } = req.body

	if (usersDB[username])
		return res.status(400).json({
			message:
				'Se ha producido un error al registrar usuario vuelve a intentarlo',
		})

	const password = await hashPassword(passwordPlainText)

	usersDB[username] = { username, password }

	console.log({ usersDB })

	res.status(201).json({ message: 'Usuario registrado.' })
})

app.post('/login', async (req, res) => {
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

	res.status(201).json({ message: 'Usuario logado.' })
})

app.listen(3000, () => console.log('SERVER ON'))
