'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TaskSchema = Schema({
	text: String,
	created_at: Date,
	finished_at: Date,
	incharge: String,
	creator: String,
	category: String,
	status: String
});

module.exports = mongoose.model('Task', TaskSchema);