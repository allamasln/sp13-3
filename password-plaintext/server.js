const express = require('express')

const app = express()

app.use(express.json())

const usersDB = {}

app.post('/register', (req, res) => {
	const { username, password } = req.body

	usersDB[username] = { username, password }

	console.log({ usersDB })

	res.status(201).json({ message: 'Usuario registrado.' })
})

app.listen(3000, () => console.log('SERVER ON'))
