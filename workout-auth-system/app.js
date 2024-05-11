const express = require('express')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const app = express()
const PORT = 4000

const users = [
	{
		id: 1,
		username: 'usuario1',
		password: 'contraseña1',
		name: 'Usuario Uno',
	},
	{
		id: 2,
		username: 'usuario2',
		password: 'contraseña2',
		name: 'Usuario Dos',
	},
]

const secret = crypto.randomBytes(64).toString('hex')
const hashedSecret = bcrypt.hashSync(secret, 10)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
	session({
		secret: hashedSecret,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
)

function generateToken(user) {
	return jwt.sign({ user: user.id }, hashedSecret, {
		expiresIn: '1h',
	})
}

function verifyToken(req, res, next) {
	const token = req.session.token
	if (!token) {
		return res.status(401).json({ mensaje: 'token no generado' })
	}

	jwt.verify(token, hashedSecret, (err, decoded) => {
		if (err) {
			return res.status(401).json({ mensaje: 'token inválido' })
		}
		req.user = decoded.user
		next()
	})
}

app.get('/', (req, res) => {
	// Verifica si el usuario está logado
	if (req.session.token) {
		res.send(`
      <h1>Bienvenido al Dashboard</h1>
      <a href="/dashboard">Ir al dashboard</a>
      <form action="/logout" method="post">
        <button type="submit">Cerrar sesión</button>
      </form>
    `)
	} else {
		const loginForm = `
      <form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>

        <button type="submit">Iniciar sesión</button>
      </form>

			<form action="/register" method="post">
			<label for="name">name:</label>
			<input type="text" id="name" name="name" required><br

        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>

        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password" required><br>

        <button type="submit">Iniciar sesión</button>
      </form>
      <a href="/dashboard">dashboard</a>
    `

		res.send(loginForm)
	}
})

app.post('/login', (req, res) => {
	const { username, password } = req.body
	const user = users.find(
		(user) => user.username === username && user.password === password
	)

	if (user) {
		const token = generateToken(user)
		req.session.token = token
		res.redirect('/dashboard')
	} else {
		res.status(401).json({ mensaje: 'Credenciales incorrectas' })
	}
})

app.post('/register', (req, res) => {
	const { username, password, name } = req.body

	users.push({ id: Math.random(), username, password, name })

	console.log(users)

	res.redirect('/')
})

app.get('/dashboard', verifyToken, (req, res) => {
	const userId = req.user
	const user = users.find((user) => user.id === userId)
	if (user) {
		res.send(`
      <h1>Bienvenido, ${user.name}</h1>
      <p>ID: ${user.id}</p>
      <p>UserName: ${user.username}</p>
      <a href="/">HOME</a>
      <form action="/logout" method="post">
        <button type="submit">Cerrar sesión</button> 
      </form>
    `)
	} else {
		res.status(401).json({ mensaje: 'Usuario no encontrado' })
	}
})

app.post('/logout', (req, res) => {
	req.session.destroy()
	res.redirect('/')
})

app.listen(PORT, () => {
	console.log(`Servidor en http://localhost:${PORT}`)
})
