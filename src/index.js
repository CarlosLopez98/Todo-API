'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3700;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todoapp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
.then(() => {
	console.log("Conexión a la base de datos establecida.");

	// Creación de servidor
	app.listen(port, () => {
		console.log("Servidor corriendo correctamente en la url: http://localhost:3700");
	});
})
.catch(error => {
	console.error(error);
});
