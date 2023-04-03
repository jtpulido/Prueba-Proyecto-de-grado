const { Router } = require('express')
const { getAllTask, createTask, deleteTask, updateTask, getTask } = require('../controllers/task.controller')
const pool = require('../db')
const router = Router()

router.get('/tasks', getAllTask)

router.post('/tasks', createTask)

router.get('/tasks/:id', getTask)

router.delete('/tasks/:id', deleteTask)

router.put('/tasks/:id', updateTask)



module.exports = router