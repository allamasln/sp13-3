const express = require('express')

const auth = require('../middleware/auth')

const { generateUniqueId } = require('../utils')

const { tasksDB } = require('../db')

const router = express.Router()

router.get('/', (req, res) => {
	res.json(tasksDB)
})

router.post('/', auth, (req, res) => {
	const { title } = req.body

	const id = generateUniqueId()

	const newTask = { id, title }

	tasksDB[id] = newTask

	res.json(newTask)
})

router.put('/:id', auth, (req, res) => {
	const { title } = req.body
	const { id } = req.params

	const taskToUpdate = tasksDB[id]

	if (!taskToUpdate)
		return res.status(404).json({ message: 'task not found' })

	const updatedTask = { id, title }

	tasksDB[id] = updatedTask

	res.json(updatedTask)
})

router.delete('/:id', auth, (req, res) => {
	const { id } = req.params

	const taskToDelete = tasksDB[id]

	if (!taskToDelete)
		return res.status(404).json({ message: 'task not found' })

	delete tasksDB[id]

	res.json(taskToDelete)
})
module.exports = router
