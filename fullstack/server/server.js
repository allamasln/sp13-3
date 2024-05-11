const express = require('express')
const session = require('express-session')

const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
)

const port = 3000

app.get('/', (req, res) => {
	// res.cookie('name', 'tobi')
	// console.log(req.cookies)

	console.log(req.session.id)

	req.session.visitas = ++req.session.visitas || 0

	console.log(req.sessionStore.sessions)

	res.send('<h1>Visitas: ' + req.session.visitas + '</h1>')
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
