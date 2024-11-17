
const express = require('express')
const userController = require('../controllers/userController')
const taskController = require('../controllers/taskController')
const jwtMiddleware = require('../middleware/jwtMiddleware')


const router = new express.Router()


// register : http://localhost:3000/register
router.post('/register',userController.registerController)

// login : http://localhost:3000/login
router.post('/login',userController.loginController)

// all-tasks : http://localhost:3000/all-tasks
router.get('/all-tasks',jwtMiddleware, taskController.allTaskController)

// add-task : http://localhost:3000/add-task
router.post('/add-task',jwtMiddleware, taskController.addTaskController)

// task/:id/edit : http://localhost:3000/task/:id/edit
router.put('/task/:id/edit',jwtMiddleware, taskController.editTaskController)

// task/:id/remove : http://localhost:3000/task/:id/remove
router.delete('/task/:id/remove',jwtMiddleware,taskController.removeTaskController)

module.exports = router