'use strict'

const express = require('express');
var UserController = require('../controllers/user.controller');

var router = express.Router();

router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.addUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);
router.post('/users/auth', UserController.authUser);

module.exports = router;
