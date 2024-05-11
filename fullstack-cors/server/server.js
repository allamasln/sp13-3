const express = require('express')

const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.static('public'))

const port = 3000

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' })
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
