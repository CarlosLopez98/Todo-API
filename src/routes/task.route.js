'use strict'

const express = require('express');
var TaskController = require('../controllers/task.controller');

var router = express.Router();

router.get('/tasks/:user_id', TaskController.getTasks);
router.get('/task/:id', TaskController.getTask);
router.post('/tasks', TaskController.addTask);
router.put('/tasks/:id', TaskController.updateTask);
router.delete('/tasks/:id', TaskController.deleteTask);

module.exports = router;
