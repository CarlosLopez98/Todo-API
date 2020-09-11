'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	lastname: String,
	nickname: String,
	email: String,
	password: String,
	role: String,
	created_at: Date	
});

module.exports = mongoose.model('User', UserSchema);