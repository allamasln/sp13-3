const express = require('express')

const app = express()

require('./startup/routes')(app)

app.listen(3000, () => console.log('SERVER ON'))
